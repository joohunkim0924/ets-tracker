/** Minimal Vite `import.meta.env` typing for JS + tsc (see `jsconfig` types: []) */
interface ImportMetaEnv {
  readonly VITE_AFT_ANALYSIS_API_BASE_URL?: string;
  /** Google Gemini API key (AIza…) */
  readonly VITE_AI_ANALYSIS_KEY?: string;
  /** Model id exactly as Gemini expects (e.g. gemini-1.5-flash-latest or models/gemini-2.0-flash) */
  readonly VITE_AI_ANALYSIS_MODEL?: string;
  /** API version: v1beta (default) or v1 */
  readonly VITE_AI_API_VERSION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
