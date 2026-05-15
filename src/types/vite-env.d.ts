/** Minimal Vite `import.meta.env` typing for JS + tsc (see `jsconfig` types: []) */
interface ImportMetaEnv {
  readonly VITE_AFT_ANALYSIS_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
