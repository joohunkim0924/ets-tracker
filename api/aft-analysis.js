const DEFAULT_MODEL = 'openai/gpt-oss-20b';

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });

    req.on('error', reject);
  });
}

function extractText(responseJson) {
  const chatText = responseJson.choices?.[0]?.message?.content;
  if (typeof chatText === 'string') return chatText.trim();

  if (typeof responseJson.output_text === 'string') return responseJson.output_text.trim();

  const output = Array.isArray(responseJson.output) ? responseJson.output : [];
  return output
    .flatMap((item) => (Array.isArray(item.content) ? item.content : []))
    .map((content) => content.text || content.output_text || '')
    .filter(Boolean)
    .join('\n')
    .trim();
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'GROQ_API_KEY is not configured.' });
    return;
  }

  let payload;
  try {
    payload = await readBody(req);
  } catch (_error) {
    res.status(400).json({ error: 'Invalid JSON body.' });
    return;
  }

  const { scores, latest, previous, eventSummary, trendSummary, requestId } = payload;
  if (!Array.isArray(scores) || !latest || !Array.isArray(eventSummary) || !trendSummary) {
    res.status(400).json({ error: 'Missing AFT score history or event trend summary.' });
    return;
  }

  const model = process.env.GROQ_AFT_ANALYSIS_MODEL || DEFAULT_MODEL;
  const totalDelta = previous ? (latest.total_score || 0) - (previous.total_score || 0) : null;

  const instructions = [
    'You are a practical Army fitness coach helping a soldier interpret AFT score history.',
    'Analyze the full historical AFT trend, not only the latest score. Compare earliest, previous, and latest scores when available.',
    'Call out improving, declining, and stagnant events. Use the event trend data to choose priorities.',
    'Return Markdown only, with these exact sections: Overall Assessment, Historical Trend, Priority Focus Areas, Weekly Workout Plan, Nutrition & Recovery, Motivational Close.',
    'Use concise, specific, field-friendly guidance. Avoid medical claims. If risk of injury is implied, recommend seeing a qualified professional.',
    'Do not claim to be official Army policy. Do not mention implementation details.',
    'Keep the response under 550 words.',
  ].join(' ');

  const input = JSON.stringify({
    request_id: requestId || null,
    all_scores_newest_first: scores,
    latest_score: latest,
    previous_score: previous || null,
    total_delta: totalDelta,
    latest_event_levels: eventSummary,
    historical_trends: trendSummary,
  });

  try {
    const groqResponse = await fetch('https://api.groq.com/openai/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        instructions,
        input,
        max_output_tokens: 1100,
        store: false,
      }),
    });

    const responseJson = await groqResponse.json().catch(() => ({}));

    if (!groqResponse.ok) {
      res.status(groqResponse.status).json({
        error: responseJson.error?.message || 'Groq analysis request failed.',
      });
      return;
    }

    const analysis = extractText(responseJson);
    if (!analysis) {
      res.status(502).json({ error: 'Groq returned an empty analysis.' });
      return;
    }

    res.status(200).json({ analysis, model, source: 'groq-responses' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Unable to generate AFT analysis.' });
  }
}
