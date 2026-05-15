const DEFAULT_GATEWAY_BASE = 'https://ai-gateway.vercel.sh/v1';
const DEFAULT_MODEL = 'openai/gpt-4o-mini';

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

function gatewayBaseUrl() {
  const raw = (process.env.VITE_AI_GATEWAY_BASE_URL || DEFAULT_GATEWAY_BASE).replace(/\/$/, '');
  return raw.endsWith('/v1') ? raw : `${raw}/v1`;
}

function buildSystemPrompt() {
  return [
    'You are a U.S. Army Master Fitness Trainer (MFT) writing for one soldier.',
    'Tone: professional, direct, and encouraging. Use Army fitness vocabulary where appropriate.',
    'Ground every observation in the numeric data provided (raw scores, points, trends).',
    'Explicitly call out weaknesses and likely limiting factors (e.g., muscular endurance vs aerobic capacity).',
    'Include a clear **4-week improvement plan** with week-by-week focus, session frequency, and example work/rest prescriptions.',
    'Cover Push-Ups, Plank (core endurance; the Army ACFT uses plank instead of sit-ups), and the 2-mile run as priority events when data exists.',
    'If other events (e.g. deadlift, sprint-drag-carry) are in the data, weave them into accessory or secondary work only when relevant.',
    'Output **Markdown only**. Use headings, short paragraphs, and bullet lists.',
    'Do not give medical diagnoses or claim to replace medical care. Avoid unsafe extremes (e.g. daily max-effort runs).',
    'Do not claim to be official Army policy or an official scoring authority.',
    'Keep total length reasonable (under ~900 words) but do not omit the 4-week plan.',
  ].join(' ');
}

function buildUserContent({ scores, latest, previous, eventSummary, trendSummary }) {
  return [
    'Analyze the following AFT / ACFT-style score data and respond per your instructions.',
    '',
    '### Latest record (newest first index 0)',
    JSON.stringify(latest, null, 2),
    '',
    '### Previous record (if any)',
    previous ? JSON.stringify(previous, null, 2) : '(none)',
    '',
    '### Latest event summary (points + levels)',
    JSON.stringify(eventSummary, null, 2),
    '',
    '### Historical trend summary',
    JSON.stringify(trendSummary, null, 2),
    '',
    '### Full history (newest first, truncated if very long)',
    JSON.stringify(scores.slice(0, 24), null, 2),
  ].join('\n');
}

function extractChatCompletionText(json) {
  const choice = json?.choices?.[0];
  const content = choice?.message?.content;
  if (typeof content === 'string' && content.trim()) return content.trim();
  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part?.text === 'string' ? part.text : ''))
      .join('')
      .trim();
  }
  return '';
}

export default async function handler(req, res) {
  const allowedOrigin = process.env.AI_ANALYSIS_ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cache-Control');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.VITE_AI_ANALYSIS_KEY || process.env.AI_ANALYSIS_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: 'AI analysis is not configured. Set VITE_AI_ANALYSIS_KEY in .env.local (dev) or project env (Vercel).',
    });
    return;
  }

  let payload;
  try {
    payload = await readBody(req);
  } catch (_error) {
    res.status(400).json({ error: 'Invalid JSON body.' });
    return;
  }

  const { scores, latest, previous, eventSummary, trendSummary } = payload;
  if (!Array.isArray(scores) || !latest || !Array.isArray(eventSummary) || !trendSummary) {
    res.status(400).json({ error: 'Missing AFT score history or event trend summary.' });
    return;
  }

  const model = process.env.VITE_AI_ANALYSIS_MODEL || process.env.AI_ANALYSIS_MODEL || DEFAULT_MODEL;
  const url = `${gatewayBaseUrl()}/chat/completions`;

  try {
    const gatewayResponse = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.45,
        max_tokens: 2200,
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          {
            role: 'user',
            content: buildUserContent({ scores, latest, previous, eventSummary, trendSummary }),
          },
        ],
      }),
    });

    const responseJson = await gatewayResponse.json().catch(() => ({}));

    if (!gatewayResponse.ok) {
      res.status(gatewayResponse.status).json({
        error:
          responseJson?.error?.message ||
          responseJson?.message ||
          `AI Gateway request failed (${gatewayResponse.status}).`,
      });
      return;
    }

    const analysis = extractChatCompletionText(responseJson);
    if (!analysis) {
      res.status(502).json({ error: 'The model returned an empty analysis.' });
      return;
    }

    res.status(200).json({
      analysis,
      model: responseJson?.model || model,
      source: 'vercel-ai-gateway',
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Unable to generate AFT analysis.' });
  }
}
