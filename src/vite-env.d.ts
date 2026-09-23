/// <reference types="vite/client" />

/**
 * Variables d'environnement SchoolOS (fichier .env.local à la racine du projet).
 * Elles sont injectées à la compilation : redémarrez `npm run dev` ou relancez
 * `npm run build` après toute modification.
 */
interface ImportMetaEnv {
  /** URL du Web App Google Apps Script qui enregistre les candidatures dans Google Sheets */
  readonly VITE_APPS_SCRIPT_URL?: string;
  /** URL publique du site */
  readonly VITE_APP_URL?: string;
}
