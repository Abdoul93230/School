/**
 * Candidatures Fondateurs → Google Sheets
 * ────────────────────────────────────────────────────────────────────────────
 * Le formulaire de candidature (landing page + présentation) envoie la
 * candidature à un Web App Google Apps Script qui écrit la ligne dans la
 * feuille « Candidatures ». Le script complet est dans `google-apps-script.js`
 * à la racine du projet — voir aussi la section « Candidatures » du README.
 *
 * Configuration : renseignez VITE_APPS_SCRIPT_URL dans `.env.local`
 * (voir `.env.example`), puis relancez `npm run dev` ou `npm run build`.
 */

/** URL du Web App Apps Script (vide = mode démo : rien n'est envoyé) */
export const APPS_SCRIPT_URL = (import.meta.env.VITE_APPS_SCRIPT_URL || '').trim();

/** true dès que l'URL du Web App est configurée */
export const SHEET_ENABLED = APPS_SCRIPT_URL.length > 0;

/** Charge utile envoyée au script */
export interface Candidature {
  name: string;
  school: string;
  whatsapp: string;
  email?: string;
  students?: string;
  country?: string;
  source?: string;
}

export interface CandidatureResult {
  ok: boolean;
  /** Numéro de Fondateur attribué par la feuille (colonne « # ») */
  number?: number;
  /** true si cette candidature avait déjà été enregistrée (double clic) */
  duplicate?: boolean;
  error?: string;
}

/** Au-delà, on considère que le réseau est en cause (le script répond en < 2 s) */
const TIMEOUT_MS = 15000;

/** Appel bas niveau au Web App — renvoie le JSON décodé */
async function callScript(init: RequestInit): Promise<Record<string, unknown>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(APPS_SCRIPT_URL, {
      ...init,
      signal: controller.signal,
      redirect: 'follow',
    });
    return JSON.parse(await res.text());
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Enregistre une candidature dans Google Sheets.
 * Ne lève jamais d'exception : renvoie toujours un résultat exploitable pour l'UI.
 */
export async function sendCandidature(data: Candidature): Promise<CandidatureResult> {
  // Mode démo (aucune URL configurée) : on ne bloque pas le visiteur
  if (!SHEET_ENABLED) return { ok: true };

  try {
    const json = await callScript({
      method: 'POST',
      // text/plain = « requête simple » : évite le préflight CORS, et
      // Apps Script lit malgré tout le corps via e.postData.contents.
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(data),
    });

    if (json.success !== true) {
      return { ok: false, error: typeof json.error === 'string' ? json.error : 'Candidature refusée par le serveur.' };
    }

    return {
      ok: true,
      number: typeof json.number === 'number' ? json.number : undefined,
      duplicate: json.duplicate === true,
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Erreur réseau inconnue',
    };
  }
}

/**
 * Nombre de candidatures déjà enregistrées dans la feuille.
 * Permet d'afficher les places restantes réellement disponibles (partagé
 * entre tous les visiteurs, pas seulement l'appareil en cours).
 * Renvoie null si la feuille n'est pas configurée ou injoignable.
 */
export async function fetchCandidatureCount(): Promise<number | null> {
  if (!SHEET_ENABLED) return null;

  try {
    const json = await callScript({ method: 'GET' });
    if (json.success === true && typeof json.count === 'number') return json.count;
    return null;
  } catch {
    return null;
  }
}
