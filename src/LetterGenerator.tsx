import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Building2, User, Calendar, FileText } from 'lucide-react';

function formatDateFr(iso: string): string {
  if (!iso) return '___________';
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  return `${jours[date.getDay()]} ${d} ${mois[m - 1]} ${y}`;
}

interface Slot { date: string; heure: string; }

interface LetterProps {
  destTitre: string; destNom: string; destEtab: string;
  destAdresse: string; destVille: string; letterDate: string;
  slots: Slot[]; expedNom: string; expedFonction: string;
  expedTel: string; expedEmail: string; formuleAppel: string;
}

// forcer l'impression des backgrounds dans tous les navigateurs
const forcePrint: React.CSSProperties = {
  WebkitPrintColorAdjust: 'exact',
  printColorAdjust: 'exact',
} as React.CSSProperties;

function LetterBody(p: LetterProps) {
  const hasSlots = p.slots.some(s => s.date);
  const base: React.CSSProperties = {
    fontFamily: "'Georgia', 'Garamond', serif",
    fontSize: '0.9rem',
    lineHeight: '1.85',
    color: '#1e293b',
    background: 'white',
    padding: '2.5rem',
    ...forcePrint,
  };

  return (
    <div style={base}>
      {/* En-tête */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.25rem', paddingBottom: '1.5rem', borderBottom: '2px solid #0f172a', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            {/* logo carré — fond forcé à l'impression */}
            <div style={{
              width: '1.75rem', height: '1.75rem',
              background: '#0f172a', borderRadius: '0.375rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              ...forcePrint,
            }}>
              <span style={{ color: '#fbbf24', fontWeight: '700', fontSize: '0.75rem', fontFamily: 'Inter, sans-serif' }}>S</span>
            </div>
            <span style={{ fontWeight: '700', fontSize: '1.125rem', color: '#0f172a', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em' }}>
              Smart<span style={{ color: '#f59e0b' }}>Limb</span>
            </span>
          </div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.725rem', color: '#64748b' }}>SchoolOS — Plateforme de gestion scolaire</div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.725rem', color: '#94a3b8', marginTop: '0.1rem' }}>Niamey, Niger · schoolos.africa</div>
        </div>
        <div style={{ textAlign: 'right', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#475569' }}>
          Niamey, le {p.letterDate ? formatDateFr(p.letterDate) : '___________'}
        </div>
      </div>

      {/* Destinataire */}
      <div style={{ marginBottom: '2rem', fontSize: '0.875rem' }}>
        <div>{p.destTitre}{p.destNom ? ` ${p.destNom}` : ''}</div>
        <div style={{ fontWeight: '600' }}>{p.destEtab || 'Nom de l\'établissement'}</div>
        {p.destAdresse && <div style={{ color: '#64748b' }}>{p.destAdresse}</div>}
        <div>{p.destVille || 'Ville'}</div>
      </div>

      {/* Objet */}
      <div style={{ marginBottom: '1.75rem', fontSize: '0.875rem' }}>
        <span style={{ fontWeight: '700', color: '#0f172a' }}>Objet : </span>
        <span style={{ textDecoration: 'underline' }}>Demande d'audience — Initiative de transformation numérique pour les établissements privés du Niger</span>
      </div>

      {/* Corps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <p>{p.formuleAppel},</p>

        <p>Nous avons l'honneur de solliciter une audience auprès de vous au sujet d'une initiative portée par <strong>SmartLimb</strong>, entreprise technologique nigérienne, à destination d'un nombre très limité d'établissements privés de notre pays.</p>

        <p>Cette initiative concerne directement la manière dont certains établissements ont réussi à <strong>significativement améliorer leur situation financière et leur image auprès des familles</strong> — sans investissement de leur part, et en moins d'une rentrée scolaire.</p>

        <p>Nous ne souhaitons pas en détailler la nature par écrit, car il s'agit d'un programme réservé à un cercle restreint de directions visionnaires, et les modalités méritent d'être présentées et discutées de vive voix, à votre convenance.</p>

        <p>Ce que nous pouvons vous dire à ce stade : <strong>plusieurs établissements de Niamey ont déjà manifesté leur intérêt</strong>, et le nombre de places disponibles est volontairement limité. Nous tenons à ce que votre établissement ait l'opportunité d'en être informé avant que le programme ne soit complet.</p>

        <div>
          <p style={{ marginBottom: '0.5rem' }}>Nous nous permettons de vous proposer les créneaux suivants, en fonction de votre disponibilité :</p>
          <ul style={{ listStyle: 'none', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            {hasSlots
              ? p.slots.filter(s => s.date).map((sl, i) => (
                <li key={i} style={{ display: 'flex', gap: '0.75rem' }}>
                  <span style={{ color: '#f59e0b', flexShrink: 0 }}>–</span>
                  <span>{formatDateFr(sl.date)}, à {sl.heure} ;</span>
                </li>
              ))
              : [1, 2, 3].map(i => (
                <li key={i} style={{ display: 'flex', gap: '0.75rem', color: '#cbd5e1' }}>
                  <span>–</span><span>Option {i} : ________________________________</span>
                </li>
              ))
            }
          </ul>
        </div>

        <p>Nous demeurons naturellement disponibles pour nous adapter à votre agenda. Un simple message au <strong>{p.expedTel || '________________'}</strong> suffit pour confirmer le créneau qui vous convient.</p>

        <p style={{ marginTop: '0.5rem' }}>Dans l'attente d'une réponse favorable de votre part, nous vous prions d'agréer, {p.formuleAppel}, l'expression de nos respectueuses salutations.</p>
      </div>

      {/* Signature */}
      <div style={{ marginTop: '3.5rem', display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.9rem' }}>{p.expedNom || 'Nom du représentant'}</div>
          <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{p.expedFonction}</div>
          <div style={{ fontWeight: '600', color: '#475569', marginTop: '0.25rem', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif' }}>SmartLimb — SchoolOS</div>
          {p.expedTel && <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.15rem' }}>Tél : {p.expedTel}</div>}
          {p.expedEmail && <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{p.expedEmail}</div>}
          <div style={{ marginTop: '4rem', height: '1px', width: '160px', background: '#cbd5e1', marginLeft: 'auto' }}></div>
          <div style={{ fontSize: '0.65rem', color: '#cbd5e1', marginTop: '0.2rem', fontFamily: 'Inter, sans-serif' }}>Signature</div>
        </div>
      </div>
    </div>
  );
}

export default function LetterGenerator() {
  const navigate = useNavigate();
  const [destTitre, setDestTitre] = useState('M. le Directeur');
  const [destNom, setDestNom] = useState('');
  const [destEtab, setDestEtab] = useState('');
  const [destAdresse, setDestAdresse] = useState('');
  const [destVille, setDestVille] = useState('Niamey');
  const [letterDate, setLetterDate] = useState('');
  const [slots, setSlots] = useState<Slot[]>([
    { date: '', heure: '09h00' },
    { date: '', heure: '11h00' },
    { date: '', heure: '15h00' },
  ]);
  const [expedNom, setExpediteurNom] = useState('');
  const [expedFonction, setExpediteurFonction] = useState('Directeur Commercial');
  const [expedTel, setExpediteurTel] = useState('+227 ');
  const [expedEmail, setExpediteurEmail] = useState('');
  const [mobileTab, setMobileTab] = useState<'form'|'preview'>('form');

  const formuleAppel = (() => {
    if (destTitre.includes('Proviseure')) return 'Madame la Proviseure';
    if (destTitre.includes('Proviseur')) return 'Monsieur le Proviseur';
    if (destTitre.includes('Présidente')) return 'Madame la Présidente';
    if (destTitre.includes('Président')) return 'Monsieur le Président';
    if (destTitre.startsWith('Mme')) return 'Madame la Directrice';
    return 'Monsieur le Directeur';
  })();

  const updateSlot = (i: number, k: keyof Slot, v: string) =>
    setSlots(prev => prev.map((sl, idx) => idx === i ? { ...sl, [k]: v } : sl));

  const letterProps: LetterProps = {
    destTitre, destNom, destEtab, destAdresse, destVille,
    letterDate, slots, expedNom, expedFonction,
    expedTel, expedEmail, formuleAppel,
  };

  const inp = "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 placeholder:text-slate-300 transition-all bg-white";
  const lbl = "text-xs font-medium text-slate-500 mb-1.5 block";

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ─── Bloc fixe en haut : en-tête + onglets mobiles ─── */}
      <div className="no-print sticky top-0 z-50 bg-white">
      <header className="bg-white border-b border-slate-100 px-4 md:px-10 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => navigate(-1)} className="flex items-center space-x-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors shrink-0">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Retour</span>
          </button>
          <span className="hidden sm:block h-4 w-px bg-slate-200 shrink-0"></span>
          <div className="flex items-center space-x-2 min-w-0">
            <FileText className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="font-semibold text-slate-900 text-sm truncate">Lettre d'audience</span>
          </div>
        </div>
        <button onClick={() => window.print()}
          className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-700 text-white font-semibold px-3 md:px-4 py-2 rounded-lg text-sm transition-colors shrink-0">
          <Printer className="w-4 h-4" />
          <span className="hidden sm:inline">Imprimer / PDF</span>
          <span className="sm:hidden">PDF</span>
        </button>
      </header>

      {/* ─── Tabs mobiles (visible < lg) ─── */}
      <div className="lg:hidden bg-white border-b border-slate-100 px-4 py-2">
        <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
          <button onClick={() => setMobileTab('form')}
            className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${mobileTab === 'form' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
            ✏️ Remplir
          </button>
          <button onClick={() => setMobileTab('preview')}
            className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${mobileTab === 'preview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
            👁 Aperçu
          </button>
        </div>
      </div>
      </div>

      {/* ─── Layout principal ─── */}
      <div className="no-print max-w-7xl mx-auto px-4 md:px-8 py-6 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">

        {/* === FORMULAIRE === */}
        <div className={`space-y-4 ${mobileTab === 'preview' ? 'hidden lg:block' : ''}`}>

          {/* Destinataire */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5">
            <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-amber-500" /><span>Établissement destinataire</span>
            </h2>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Titre</label>
                  <select value={destTitre} onChange={e => setDestTitre(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 bg-white transition-all">
                    <option>M. le Directeur</option>
                    <option>Mme la Directrice</option>
                    <option>M. le Proviseur</option>
                    <option>Mme la Proviseure</option>
                    <option>M. le Président</option>
                    <option>Mme la Présidente</option>
                  </select>
                </div>
                <div>
                  <label className={lbl}>Nom complet (optionnel)</label>
                  <input value={destNom} onChange={e => setDestNom(e.target.value)} placeholder="Issoufou Mahamadou" className={inp} />
                </div>
              </div>
              <div>
                <label className={lbl}>Nom de l'établissement *</label>
                <input value={destEtab} onChange={e => setDestEtab(e.target.value)} placeholder="Lycée Privé Malam Issa" className={inp} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Adresse / Quartier</label>
                  <input value={destAdresse} onChange={e => setDestAdresse(e.target.value)} placeholder="Quartier Plateau" className={inp} />
                </div>
                <div>
                  <label className={lbl}>Ville</label>
                  <input value={destVille} onChange={e => setDestVille(e.target.value)} placeholder="Niamey" className={inp} />
                </div>
              </div>
            </div>
          </div>

          {/* Dates & créneaux */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5">
            <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-amber-500" /><span>Date & créneaux proposés</span>
            </h2>
            <div className="space-y-4">
              <div>
                <label className={lbl}>Date de rédaction de la lettre</label>
                <input type="date" value={letterDate} onChange={e => setLetterDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 bg-white transition-all" />
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500 mb-3">3 créneaux proposés — adaptables à leur agenda</div>
                <div className="space-y-2">
                  {slots.map((slot, i) => (
                    <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">Option {i + 1} — Date</label>
                        <input type="date" value={slot.date} onChange={e => updateSlot(i, 'date', e.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400 bg-white transition-all" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">Heure</label>
                        <input value={slot.heure} onChange={e => updateSlot(i, 'heure', e.target.value)} placeholder="09h00" className={inp} />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-2 italic">Indicatifs — vous adaptez lors du contact téléphonique.</p>
              </div>
            </div>
          </div>

          {/* Expéditeur */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5">
            <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <User className="w-4 h-4 text-amber-500" /><span>Expéditeur (représentant SmartLimb)</span>
            </h2>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Nom complet *</label>
                  <input value={expedNom} onChange={e => setExpediteurNom(e.target.value)} placeholder="Ibrahim Moussa" className={inp} />
                </div>
                <div>
                  <label className={lbl}>Titre / Fonction</label>
                  <input value={expedFonction} onChange={e => setExpediteurFonction(e.target.value)} placeholder="Directeur Commercial" className={inp} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Téléphone / WhatsApp *</label>
                  <input value={expedTel} onChange={e => setExpediteurTel(e.target.value)} placeholder="+227 xx xx xx xx" className={inp} />
                </div>
                <div>
                  <label className={lbl}>Email</label>
                  <input value={expedEmail} onChange={e => setExpediteurEmail(e.target.value)} placeholder="contact@smartlimb.ne" className={inp} />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 leading-relaxed">
            <strong>Conseil :</strong> Remplissez les champs, basculez sur l'onglet Aperçu pour vérifier, puis cliquez <strong>PDF</strong> pour imprimer et déposer physiquement dans l'établissement.
          </div>
        </div>

        {/* === APERÇU === */}
        <div className={`lg:sticky lg:top-[4.5rem] ${mobileTab === 'form' ? 'hidden lg:block' : ''}`}>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 flex items-center justify-between">
            <span>Aperçu temps réel</span>
            <button onClick={() => window.print()} className="flex items-center space-x-1.5 text-amber-600 hover:text-amber-700 transition-colors normal-case font-medium text-xs">
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer</span>
            </button>
          </div>
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <LetterBody {...letterProps} />
          </div>
        </div>
      </div>

      {/* ─── Zone imprimée uniquement ─── */}
      <div className="print-only">
        <LetterBody {...letterProps} />
      </div>
    </div>
  );
}
