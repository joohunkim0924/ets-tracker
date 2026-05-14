export async function generateAftAnalysis({ scores, latest, previous, eventSummary, trendSummary, requestId }) {
  const response = await fetch('/api/aft-analysis', {
    method: 'POST',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify({ scores, latest, previous, eventSummary, trendSummary, requestId }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error || 'Unable to generate analysis.');
  }

  if (!payload || typeof payload.analysis !== 'string' || !payload.analysis.trim()) {
    throw new Error('The analysis endpoint returned an invalid response.');
  }

  return payload;
}
