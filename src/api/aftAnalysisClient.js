export async function generateAftAnalysis({ latest, previous, eventSummary }) {
  const response = await fetch('/api/aft-analysis', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ latest, previous, eventSummary }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || 'Unable to generate analysis.');
  }

  return payload;
}
