/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONN_DETAILS_ENDPOINT?: string;
  readonly VITE_SHOW_SETTINGS_MENU?: string;
  readonly VITE_LK_RECORD_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
