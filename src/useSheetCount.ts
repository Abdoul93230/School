import { useState, useEffect, useCallback } from 'react';
import { fetchCandidatureCount } from './candidature';

/**
 * Compteur de candidatures partagé (Google Sheets) avec états de chargement.
 * 'loading' → requête en cours · 'ready' → count valide · 'offline' → feuille injoignable
 */
export function useSheetCount(): {
  sheetCount: number | null;
  status: 'loading' | 'ready' | 'offline';
  setCount: (n: number) => void;
} {
  const [sheetCount, setSheetCount] = useState<number | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'offline'>('loading');

  useEffect(() => {
    let alive = true;
    fetchCandidatureCount().then((count) => {
      if (!alive) return;
      if (count !== null) { setSheetCount(count); setStatus('ready'); }
      else setStatus('offline');
    });
    return () => { alive = false; };
  }, []);

  /** Mise à jour immédiate après un envoi réussi (numéro attribué par la feuille) */
  const setCount = useCallback((n: number) => {
    setSheetCount(n);
    setStatus('ready');
  }, []);

  return { sheetCount, status, setCount };
}
