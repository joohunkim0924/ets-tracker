# ETS Tracker

Offline-first tracker for soldiers to manage ETS countdowns, AFT history, weapons records, and battle buddy timers.

## Development

1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Build for production: `npm run build`

## OpenAI AFT Analysis

The AFT analysis uses a serverless route at `/api/aft-analysis`.

Set `OPENAI_API_KEY` in the deployment environment. By default, the route uses `gpt-5-mini`; set `OPENAI_AFT_ANALYSIS_MODEL` to override it.

## Data Storage

All app data is stored locally in the browser with `localStorage`, so the app works without a backend connection.
