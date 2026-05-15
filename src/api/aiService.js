import { GoogleGenerativeAI } from '@google/generative-ai';

const LOG_PREFIX = '[AFT AI]';

/** ACFT / AFT events tracked in the app (order sent to Gemini). */
const AFT_EVENTS = [
  { key: 'deadlift', label: 'Deadlift', pointsKey: 'deadlift_points', unit: 'lbs', timeBased: false },
  { key: 'pushups', label: 'Push-Ups', pointsKey: 'pushups_points', unit: 'reps', timeBased: false },
  { key: 'sprint_drag_carry', label: 'Sprint-Drag-Carry', pointsKey: 'sprint_drag_carry_points', unit: 'time', timeBased: true },
  { key: 'plank', label: 'Plank', pointsKey: 'plank_points', unit: 'time', timeBased: true },
  { key: 'two_mile_run', label: '2-Mile Run', pointsKey: 'two_mile_run_points', unit: 'time', timeBased: true },
];

/**
 * Use env model id exactly. The SDK adds `models/` only when the id has no `/`.
 * We never prepend `models/` here — only collapse accidental `models/models/…`.
 */
export function resolveModelId() {
  const raw = import.meta.env.VITE_AI_ANALYSIS_MODEL?.trim();
  if (!raw) {
    throw new Error('VITE_AI_ANALYSIS_MODEL is not set.');
  }
  return raw.replace(/^models\/models\//, 'models/');
}

/** @returns {'v1' | 'v1beta'} */
export function resolveApiVersion() {
  const version = import.meta.env.VITE_AI_API_VERSION?.trim();
  if (version === 'v1' || version === 'v1beta') return version;
  return 'v1beta';
}

function logGeminiError(phase, error, details = {}) {
  console.error(LOG_PREFIX, phase, {
    ...details,
    error,
    name: error?.name,
    message: error?.message,
    stack: error?.stack,
    cause: error?.cause,
  });
}

function formatSecondsAsTime(totalSeconds) {
  const seconds = Number(totalSeconds);
  if (Number.isNaN(seconds)) return null;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatEventResult(score, event) {
  const raw = score?.[event.key];
  const points = score?.[event.pointsKey];

  if (raw === null || raw === undefined || raw === '') {
    return { raw: null, points: points ?? null, display: '—' };
  }

  if (event.timeBased) {
    const display = formatSecondsAsTime(raw);
    return { raw: Number(raw), points: points ?? null, display: display ?? String(raw) };
  }

  return {
    raw: Number(raw),
    points: points ?? null,
    display: `${raw} ${event.unit}`,
  };
}

function buildAftEventsPayload(score) {
  if (!score) return null;

  return AFT_EVENTS.map((event) => {
    const result = formatEventResult(score, event);
    return {
      event: event.label,
      key: event.key,
      raw_value: result.raw,
      raw_display: result.display,
      points: result.points,
    };
  });
}

function buildSystemInstruction() {
  return [
    'You are a U.S. Army Master Fitness Trainer (MFT) writing for one soldier.',
    'Tone: professional, direct, and encouraging. Use Army fitness vocabulary where appropriate.',
    'Ground every observation in the numeric data provided (raw scores, points, trends).',
    'Explicitly analyze all five events: Deadlift, Push-Ups, Sprint-Drag-Carry, Plank, and 2-Mile Run.',
    'Identify weaknesses and likely limiting factors (e.g., muscular endurance vs aerobic capacity).',
    'Include a clear **4-week improvement plan** with week-by-week focus, session frequency, and example work/rest prescriptions.',
    'Output **Markdown only**. Use headings, short paragraphs, and bullet lists.',
    'Do not give medical diagnoses or claim to replace medical care. Avoid unsafe extremes.',
    'Do not claim to be official Army policy or an official scoring authority.',
    'Keep total length reasonable (under ~900 words) but do not omit the 4-week plan.',
  ].join(' ');
}

function buildGeminiUserPrompt({ scores, latest, previous, eventSummary, trendSummary }) {
  const latestEvents = buildAftEventsPayload(latest);
  const previousEvents = previous ? buildAftEventsPayload(previous) : null;

  return [
    'Analyze this soldier\'s AFT / ACFT-style performance and provide your MFT assessment.',
    '',
    '## Required events (analyze each)',
    '1. Deadlift',
    '2. Push-Ups',
    '3. Sprint-Drag-Carry',
    '4. Plank',
    '5. 2-Mile Run',
    '',
    '## Latest test date',
    latest?.date ?? 'unknown',
    '',
    '## Latest event scores',
    JSON.stringify(latestEvents, null, 2),
    '',
    '## Previous test event scores',
    previousEvents ? JSON.stringify(previousEvents, null, 2) : '(no previous record)',
    '',
    '## Latest total score',
    latest?.total_score ?? '—',
    previous ? `Previous total: ${previous.total_score ?? '—'}` : '',
    '',
    '## Event summary (points + weak/moderate/strong)',
    JSON.stringify(eventSummary, null, 2),
    '',
    '## Historical trends',
    JSON.stringify(trendSummary, null, 2),
    '',
    '## Score history (newest first, up to 24)',
    JSON.stringify(
      scores.slice(0, 24).map((s) => ({
        date: s.date,
        total_score: s.total_score,
        events: buildAftEventsPayload(s),
      })),
      null,
      2,
    ),
  ].join('\n');
}

function isModelNotFoundError(error) {
  const message = error?.message || '';
  return /404|not found/i.test(message) && /model/i.test(message);
}

function extractAnalysisText(result) {
  if (!result || !result.response) {
    throw new Error(
      result
        ? 'Gemini returned a result without a response property.'
        : 'Gemini returned no result from generateContent.',
    );
  }

  const { response } = result;

  try {
    const text = response.text?.();
    if (typeof text === 'string' && text.trim()) {
      return text.trim();
    }
  } catch (textError) {
    logGeminiError('response.text() failed', textError, {
      candidates: response.candidates,
      promptFeedback: response.promptFeedback,
    });
    throw textError;
  }

  const candidateText = response.candidates?.[0]?.content?.parts
    ?.map((part) => part?.text || '')
    .join('')
    .trim();

  if (candidateText) {
    return candidateText;
  }

  const blockReason =
    response.promptFeedback?.blockReason ||
    response.candidates?.[0]?.finishReason;

  throw new Error(
    blockReason
      ? `Gemini blocked or finished without text (reason: ${blockReason}).`
      : 'Gemini returned an empty analysis.',
  );
}

/** @param {{ modelId?: string, apiVersion?: string }} [context] */
function formatError(error, context = {}) {
  const { modelId, apiVersion } = context;
  const name = error?.name || 'Error';
  const message = error?.message || String(error) || 'Unable to generate analysis.';

  if (name === 'TypeError' || /type error/i.test(message)) {
    return [
      `Gemini SDK error (${name}): ${message}`,
      apiVersion ? `API version: ${apiVersion}.` : '',
      modelId ? `Model: ${modelId}.` : '',
      'Open the browser/Web Inspector console for the full [AFT AI] log.',
    ]
      .filter(Boolean)
      .join(' ');
  }

  if (/VITE_AI_ANALYSIS_KEY|API key|not set/i.test(message)) {
    return `${message} Add your Gemini API key to .env.local, then rebuild (npm run build && npx cap sync ios).`;
  }

  if (isModelNotFoundError(error)) {
    return [
      `Model "${modelId}" was not found for API ${apiVersion}.`,
      'Set VITE_AI_ANALYSIS_MODEL to an id your key supports (e.g. gemini-2.0-flash or gemini-1.5-flash-latest).',
      'Use gemini-1.5-flash without a models/ prefix, or models/your-id if you include the prefix once.',
    ].join(' ');
  }

  if (/Load failed|Failed to fetch|NetworkError|Network request failed/i.test(message)) {
    return `${message} Check Wi‑Fi/cellular and try again.`;
  }

  return message;
}

/**
 * Calls Gemini via @google/generative-ai with explicit v1 / v1beta routing.
 * @see https://generativelanguage.googleapis.com/{apiVersion}/{model}:generateContent
 */
async function generateWithGemini({ apiKey, modelId, apiVersion, userPrompt }) {
  const requestMeta = {
    apiVersion,
    modelId,
    endpoint: `generativelanguage.googleapis.com/${apiVersion}/${modelId.includes('/') ? modelId : `models/${modelId}`}:generateContent`,
  };

  console.info(LOG_PREFIX, 'Starting generateContent', requestMeta);

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel(
    {
      model: modelId,
      systemInstruction: buildSystemInstruction(),
      generationConfig: {
        temperature: 0.45,
        maxOutputTokens: 2200,
        topP: 0.95,
      },
    },
    { apiVersion },
  );

  let result;

  try {
    result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }],
        },
      ],
    });
  } catch (error) {
    logGeminiError('generateContent failed', error, requestMeta);
    throw error;
  }

  console.info(LOG_PREFIX, 'generateContent succeeded', {
    ...requestMeta,
    hasResult: Boolean(result),
    hasResponse: Boolean(result?.response),
  });

  try {
    return extractAnalysisText(result);
  } catch (error) {
    logGeminiError('extractAnalysisText failed', error, {
      ...requestMeta,
      result,
    });
    throw error;
  }
}

/**
 * @param {object} params
 * @param {object[]} params.scores
 * @param {object} params.latest
 * @param {object} [params.previous]
 * @param {object[]} params.eventSummary
 * @param {object} params.trendSummary
 */
export async function analyzeAftWithAi({ scores, latest, previous, eventSummary, trendSummary }) {
  const apiKey = import.meta.env.VITE_AI_ANALYSIS_KEY?.trim();
  if (!apiKey) {
    throw new Error('VITE_AI_ANALYSIS_KEY is not set.');
  }

  const modelId = resolveModelId();
  const preferredVersion = resolveApiVersion();
  const userPrompt = buildGeminiUserPrompt({
    scores,
    latest,
    previous,
    eventSummary,
    trendSummary,
  });

  const versionsToTry =
    preferredVersion === 'v1beta' ? ['v1beta', 'v1'] : ['v1', 'v1beta'];

  let lastError;

  for (const apiVersion of versionsToTry) {
    try {
      const analysis = await generateWithGemini({
        apiKey,
        modelId,
        apiVersion,
        userPrompt,
      });

      return {
        analysis,
        model: modelId,
        source: `google-gemini-${apiVersion}`,
      };
    } catch (error) {
      lastError = error;
      logGeminiError('analyzeAftWithAi attempt failed', error, { modelId, apiVersion });

      if (!isModelNotFoundError(error)) {
        throw new Error(formatError(error, { modelId, apiVersion }));
      }
    }
  }

  throw new Error(formatError(lastError, { modelId, apiVersion: versionsToTry.join(' / ') }));
}
