const DEFAULT_MODEL = 'gpt-5-mini';

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
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'OPENAI_API_KEY is not configured.' });
    return;
  }

  let payload;
  try {
    payload = await readBody(req);
  } catch (_error) {
    res.status(400).json({ error: 'Invalid JSON body.' });
    return;
  }

  const { latest, previous, eventSummary } = payload;
  if (!latest || !Array.isArray(eventSummary)) {
    res.status(400).json({ error: 'Missing latest score or event summary.' });
    return;
  }

  const model = process.env.OPENAI_AFT_ANALYSIS_MODEL || DEFAULT_MODEL;
  const totalDelta = previous ? (latest.total_score || 0) - (previous.total_score || 0) : null;

  const instructions = [
    'You are a practical Army fitness coach helping a soldier interpret AFT score history.',
    'Return Markdown only, with these exact sections: Overall Assessment, Priority Focus Areas, Weekly Workout Plan, Nutrition & Recovery, Motivational Close.',
    'Use concise, specific, field-friendly guidance. Avoid medical claims. If risk of injury is implied, recommend seeing a qualified professional.',
    'Do not claim to be official Army policy. Do not mention Base44.',
    'Keep the response under 450 words.',
  ].join(' ');

  const input = JSON.stringify({
    latest_score: latest,
    previous_score: previous || null,
    total_delta: totalDelta,
    events: eventSummary,
  });

  try {
    const openAiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        instructions,
        input,
        max_output_tokens: 900,
      }),
    });

    const responseJson = await openAiResponse.json().catch(() => ({}));

    if (!openAiResponse.ok) {
      res.status(openAiResponse.status).json({
        error: responseJson.error?.message || 'OpenAI analysis request failed.',
      });
      return;
    }

    const analysis = extractText(responseJson);
    if (!analysis) {
      res.status(502).json({ error: 'OpenAI returned an empty analysis.' });
      return;
    }

    res.status(200).json({ analysis, model });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Unable to generate AFT analysis.' });
  }
}
