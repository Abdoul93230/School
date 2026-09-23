/**
 * Numéro WhatsApp (Niger) — saisie, formatage et validation.
 * ────────────────────────────────────────────────────────────
 * Le préfixe +227 est toujours affiché (non supprimable) et les 8 chiffres
 * du numéro sont groupés 2 par 2 : +227 87 72 75 01.
 */

/** Préfixe international du Niger, toujours affiché dans le champ */
export const NIGER_PREFIX = '+227';

/**
 * Extrait les 8 chiffres utiles d'une saisie libre.
 * Tolère +227, 00227, 227, un 0 initial, espaces, tirets et parenthèses.
 */
export function extractDigits(raw: string): string {
  let d = raw.replace(/\D/g, '');
  for (;;) {
    if (d.startsWith('00227')) { d = d.slice(5); continue; }
    if (d.startsWith('227')) { d = d.slice(3); continue; }
    if (d.startsWith('0')) { d = d.slice(1); continue; }
    break;
  }
  return d.slice(0, 8);
}

/** Regroupe les chiffres 2 par 2 : « 87727501 » → « 87 72 75 01 » */
export function groupDigits(digits: string): string {
  return digits.replace(/(\d{2})(?=\d)/g, '$1 ');
}

/** Formate une saisie libre pour l'affichage — le préfixe est toujours présent */
export function formatNigerInput(raw: string): string {
  const digits = groupDigits(extractDigits(raw));
  return digits ? `${NIGER_PREFIX} ${digits}` : NIGER_PREFIX;
}

/** true si le numéro saisi est complet (8 chiffres après +227) */
export function isCompleteNigerNumber(raw: string): boolean {
  return extractDigits(raw).length === 8;
}
