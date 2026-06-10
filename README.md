# Hooah!

Offline-first tracker for soldiers to manage ETS countdowns, AFT history, weapons records, and battle buddy timers.

## Development

1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Build for production: `npm run build`
4. Preview the production build locally: `npm run preview`

## Groq AFT Analysis

The AFT analysis uses a serverless route at `/api/aft-analysis`.

Set `GROQ_API_KEY` in the deployment environment. By default, the route uses `openai/gpt-oss-20b`; set `GROQ_AFT_ANALYSIS_MODEL` to override it.

`npm run build` only creates static files in `dist/`. Use `npm run preview` to test the built app locally with the Groq API route enabled, or deploy to a host that runs the `api/` serverless function such as Vercel.

For Capacitor/iOS builds, the app bundle cannot run the `api/` serverless function. Deploy the web app/API first, then set `VITE_AFT_ANALYSIS_API_BASE_URL` before building the native app:

```bash
VITE_AFT_ANALYSIS_API_BASE_URL=https://your-vercel-app.vercel.app
```

The hosted API needs `GROQ_API_KEY`. You can optionally set `AFT_ANALYSIS_ALLOWED_ORIGIN` on the hosted API to restrict CORS; otherwise it allows cross-origin requests for the native app.

## Data Storage

All app data is stored locally in the browser with `localStorage`, so the app works without a backend connection.
