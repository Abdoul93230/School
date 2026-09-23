import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendCandidature, fetchCandidatureCount, SHEET_ENABLED } from './candidature';
import { formatNigerInput, isCompleteNigerNumber, NIGER_PREFIX } from './whatsapp';
import {
  ArrowRight, Check, AlertTriangle, Shield, Zap, Award,
  CreditCard, Clock, Users, BarChart3, BookOpen, Smartphone,
  Cpu, FileText, Bell, Archive, CheckCircle2, School,
  ChevronDown, Globe, TrendingUp, X, Home, Activity,
  Wifi, Battery, Signal, Star, Settings, Search,
  Download, PenLine, GraduationCap, Calendar,
  FolderOpen, ChevronRight, Layers, Sparkles, Play,
  ArrowUpRight, MessageCircle, Eye, Lock, Rocket,
  Target, LayoutDashboard, BookMarked, MapPin, Crown
} from 'lucide-react';

const PLACES_TOTAL = 20;

/** Tranches d'effectif proposées à la candidature (qualification du prospect) */
const STUDENT_RANGES = ['Moins de 200', '200–500', '500–1 000', 'Plus de 1 000'];

/* ─────────────────────────────────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────────────────────────────────── */

function useInView(ref: React.RefObject<Element | null>, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

function useCountUp(target: number, duration = 1400, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    const steps = 50;
    let frame = 0;
    const iv = setInterval(() => {
      frame++;
      const progress = frame / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.min(Math.round(target * eased), target));
      if (frame >= steps) clearInterval(iv);
    }, duration / steps);
    return () => clearInterval(iv);
  }, [start, target, duration]);
  return val;
}

function useTypewriter(texts: string[], speed = 60, pause = 2000) {
  const [displayed, setDisplayed] = useState('');
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = texts[textIdx];
    if (!deleting) {
      if (charIdx < current.length) {
        const t = setTimeout(() => setCharIdx(c => c + 1), speed);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setDeleting(true), pause);
        return () => clearTimeout(t);
      }
    } else {
      if (charIdx > 0) {
        const t = setTimeout(() => setCharIdx(c => c - 1), speed / 2);
        return () => clearTimeout(t);
      } else {
        setDeleting(false);
        setTextIdx(i => (i + 1) % texts.length);
      }
    }
  }, [charIdx, deleting, textIdx, texts, speed, pause]);
  useEffect(() => {
    setDisplayed(texts[textIdx].slice(0, charIdx));
  }, [charIdx, textIdx, texts]);
  return displayed;
}

/* ─────────────────────────────────────────────────────────────────────────
   MINI MOCKUPS
───────────────────────────────────────────────────────────────────────── */

function LiveDashboard() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setTick(t => t + 1), 3000);
    return () => clearInterval(iv);
  }, []);
  const amounts = [38423, 39100, 40250, 41000, 42300];
  const currentAmount = amounts[tick % amounts.length];

  return (
    <div className="w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/8 shadow-[0_0_80px_rgba(0,0,0,0.8)]">
      {/* Browser chrome */}
      <div className="bg-slate-950 px-4 py-2.5 flex items-center space-x-3 border-b border-white/5">
        <div className="flex space-x-1.5">
          {['#f87171','#fbbf24','#34d399'].map(c => (
            <div key={c} className="w-3 h-3 rounded-full" style={{ background: c, opacity: 0.7 }} />
          ))}
        </div>
        <div className="flex-1 bg-white/5 rounded-md px-3 py-1 text-white/25 font-mono text-[11px] flex items-center space-x-2">
          <Shield className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
          <span>app.schoolos.africa/dashboard</span>
        </div>
        <div className="flex items-center space-x-1.5 text-[10px] text-emerald-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
          </span>
          <span>En direct</span>
        </div>
      </div>

      <div className="flex" style={{ minHeight: 380 }}>
        {/* Sidebar */}
        <div className="w-14 bg-[#080d14] flex flex-col items-center py-4 space-y-3 border-r border-white/5">
          <div className="w-8 h-8 bg-amber-400 rounded-xl flex items-center justify-center mb-1 glow-amber">
            <School className="w-4 h-4 text-slate-900" />
          </div>
          {[
            { Icon: LayoutDashboard, active: true },
            { Icon: BarChart3 }, { Icon: Users }, { Icon: CreditCard },
            { Icon: BookOpen }, { Icon: FileText }, { Icon: Settings },
          ].map(({ Icon, active }, i) => (
            <button key={i} className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${active ? 'bg-amber-400/15 text-amber-400 border border-amber-400/20' : 'text-white/15 hover:text-white/40 hover:bg-white/5'}`}>
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 p-5 space-y-4 overflow-hidden">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white/30 text-xs">Lycée Privé Malam Issa · Niamey</div>
              <div className="text-white font-bold text-sm">Bonjour, M. Ibrahim 👋</div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <button className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center border border-white/5">
                  <Bell className="w-3.5 h-3.5 text-white/40" />
                </button>
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-rose-500 rounded-full text-[7px] text-white flex items-center justify-center font-bold">3</span>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-slate-900 font-black text-xs shadow-lg shadow-amber-400/20">MI</div>
            </div>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Élèves', val: '487', sub: '+12 ce mois', color: 'from-blue-500/10 to-blue-600/5', border: 'border-blue-500/15', text: 'text-blue-400', Icon: Users },
              { label: 'Présence', val: '94%', sub: '+2% hier', color: 'from-emerald-500/10 to-emerald-600/5', border: 'border-emerald-500/15', text: 'text-emerald-400', Icon: CheckCircle2 },
              { label: 'Recouvré', val: '87%', sub: '+8% trimestre', color: 'from-amber-500/10 to-amber-600/5', border: 'border-amber-500/15', text: 'text-amber-400', Icon: TrendingUp },
              { label: 'Alertes', val: '3', sub: '−1 résolu', color: 'from-rose-500/10 to-rose-600/5', border: 'border-rose-500/15', text: 'text-rose-400', Icon: AlertTriangle },
            ].map((k, i) => (
              <div key={i} className={`rounded-xl p-3 bg-gradient-to-br ${k.color} border ${k.border} relative overflow-hidden`}>
                <k.Icon className={`w-3.5 h-3.5 ${k.text} mb-1.5 opacity-60`} />
                <div className={`text-lg font-black ${k.text}`}>{k.val}</div>
                <div className="text-white/40 text-[9px] leading-tight mt-0.5">{k.label}</div>
                <div className="text-white/20 text-[8px]">{k.sub}</div>
              </div>
            ))}
          </div>

          {/* Chart + activity */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 bg-white/3 border border-white/5 rounded-xl p-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/50 text-xs font-semibold">Trésorerie — 6 mois</span>
                <div className="flex items-center space-x-1.5">
                  <span className="text-emerald-400 font-mono text-xs font-bold">
                    {currentAmount.toLocaleString()} FCFA
                  </span>
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                </div>
              </div>
              <div className="flex items-end space-x-1.5 h-14">
                {[38, 52, 44, 68, 62, 84].map((h, i, arr) => (
                  <div key={i} className="flex-1 relative group">
                    <div className={`absolute inset-x-0 bottom-0 rounded-sm transition-all duration-500 ${i === arr.length - 1 ? 'bg-gradient-to-t from-amber-400 to-amber-300' : 'bg-white/8 group-hover:bg-white/15'}`}
                      style={{ height: `${h}%` }} />
                    {i === arr.length - 1 && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-[7px] font-bold px-1 rounded whitespace-nowrap">Ce mois</div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-1.5">
                {['Jan','Fév','Mar','Avr','Mai','Jun'].map(m => (
                  <span key={m} className="text-white/15 text-[8px] flex-1 text-center">{m}</span>
                ))}
              </div>
            </div>
            <div className="bg-white/3 border border-white/5 rounded-xl p-3 space-y-2">
              <span className="text-white/40 text-[10px] font-semibold uppercase tracking-wider">Activités</span>
              {[
                { dot: 'bg-emerald-400', text: 'Paiement 45k', time: 'à l\'instant' },
                { dot: 'bg-amber-400', text: 'Absence Halima', time: '2 min' },
                { dot: 'bg-blue-400', text: 'Bulletin 3è A', time: '5 min' },
                { dot: 'bg-purple-400', text: 'Inscription', time: '12 min' },
                { dot: 'bg-rose-400', text: 'Alerte IA', time: '18 min' },
              ].map((a, i) => (
                <div key={i} className="flex items-center space-x-2 group">
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${a.dot}`} />
                  <span className="text-white/35 text-[10px] flex-1 truncate group-hover:text-white/60 transition-colors">{a.text}</span>
                  <span className="text-white/15 text-[8px] shrink-0">{a.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom: impayés alert */}
          <div className="bg-rose-500/8 border border-rose-500/15 rounded-xl px-3 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="text-rose-300/80 text-[10px]">14 familles · 5 741 500 FCFA non réglés</span>
            </div>
            <button className="bg-rose-400/20 border border-rose-400/30 text-rose-300 text-[9px] font-semibold px-2 py-1 rounded-lg hover:bg-rose-400/30 transition-colors whitespace-nowrap">
              Envoyer relances →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhoneMockup({ type }: { type: 'parent' | 'teacher' }) {
  const [activeNote, setActiveNote] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setActiveNote(n => (n + 1) % 3), 2500);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="w-36 rounded-[24px] overflow-hidden border border-white/10 bg-slate-950 shadow-[0_32px_64px_rgba(0,0,0,0.7)] mx-auto">
      {/* Notch */}
      <div className="flex justify-center pt-2 pb-0.5">
        <div className="w-14 h-4 bg-slate-900 rounded-full" />
      </div>
      {/* Status */}
      <div className="flex items-center justify-between px-3 py-0.5">
        <span className="text-white text-[8px] font-bold">9:41</span>
        <div className="flex items-center space-x-0.5">
          <Signal className="w-2 h-2 text-white" />
          <Wifi className="w-2 h-2 text-white" />
          <Battery className="w-3 h-3 text-white" />
        </div>
      </div>

      {type === 'parent' ? (
        <div className="px-2.5 pb-4 space-y-2">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white text-[9px] font-bold">Portail Parent</div>
              <div className="text-white/30 text-[7px]">Moussa Abdou · 3è A</div>
            </div>
            <div className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center text-slate-900 font-black text-[7px]">P</div>
          </div>

          {/* Alert paiement */}
          <div className="bg-amber-400/15 border border-amber-400/25 rounded-lg p-1.5 animate-shimmer">
            <div className="text-amber-300 text-[7px] font-bold">Paiement dû · T3</div>
            <div className="text-amber-200/60 text-[6px]">45 000 FCFA · Échéance 30 juin</div>
          </div>

          {/* Notes avec animation */}
          <div className="space-y-1">
            <div className="text-white/30 text-[7px] font-semibold uppercase tracking-wider">Dernières notes</div>
            {[
              { sub: 'Mathématiques', note: '18.5/20', trend: '↑', c: 'text-emerald-400' },
              { sub: 'Français', note: '14/20', trend: '→', c: 'text-blue-400' },
              { sub: 'Sciences', note: '16/20', trend: '↑', c: 'text-purple-400' },
            ].map((n, i) => (
              <div key={i} className={`flex justify-between items-center p-1.5 rounded-lg transition-all duration-500 ${activeNote === i ? 'bg-white/8 border border-white/10' : 'bg-transparent'}`}>
                <span className="text-white/50 text-[7px] truncate">{n.sub}</span>
                <div className="flex items-center space-x-1">
                  <span className={`text-[7px] font-bold ${n.c}`}>{n.note}</span>
                  <span className={`text-[6px] ${n.c}`}>{n.trend}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Présence */}
          <div className="bg-emerald-400/10 border border-emerald-400/20 rounded-lg p-1.5 flex items-center space-x-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
            <div className="text-emerald-300 text-[7px]">Présent · Aujourd'hui 8h–17h</div>
          </div>

          {/* Message */}
          <button className="w-full bg-white/5 border border-white/8 rounded-lg py-1.5 flex items-center justify-center space-x-1">
            <MessageCircle className="w-3 h-3 text-white/40" />
            <span className="text-white/35 text-[7px]">Contacter l'enseignant</span>
          </button>
        </div>
      ) : (
        <div className="px-2.5 pb-4 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white text-[9px] font-bold">Appel de classe</div>
              <div className="text-white/30 text-[7px]">3è A · Mathématiques</div>
            </div>
            <div className="bg-emerald-400/15 border border-emerald-400/20 rounded text-emerald-400 text-[6px] px-1.5 py-0.5 font-bold">8h15</div>
          </div>

          <div className="bg-white/3 rounded-lg p-1.5">
            <div className="text-white/25 text-[6px] mb-1">38 élèves · <span className="text-emerald-400">35 présents</span> · <span className="text-rose-400">3 abs</span></div>
            <div className="w-full bg-white/10 rounded-full h-1">
              <div className="bg-emerald-400 h-1 rounded-full" style={{ width: '92%' }} />
            </div>
          </div>

          <div className="space-y-1">
            {['Moussa A.', 'Halima I.', 'Zakari M.', 'Aïcha B.', 'Ibrahim S.'].map((n, i) => (
              <div key={i} className="flex items-center justify-between bg-white/3 rounded-lg px-2 py-1">
                <span className="text-white/50 text-[7px]">{n}</span>
                <div className="flex space-x-0.5">
                  <button className={`rounded text-[6px] px-1 py-0.5 font-bold transition-all ${i === 2 ? 'bg-rose-500 text-white' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'}`}>
                    {i === 2 ? 'Abs' : '✓'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full bg-amber-400 rounded-xl py-1.5 text-slate-900 font-black text-[8px] flex items-center justify-center space-x-1">
            <Check className="w-3 h-3" />
            <span>Valider l'appel</span>
          </button>
        </div>
      )}
    </div>
  );
}

function BulletinMockup() {
  return (
    <div className="w-full bg-white rounded-xl overflow-hidden shadow-xl border border-slate-200 text-[9px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-amber-400 rounded-lg flex items-center justify-center">
            <School className="w-3.5 h-3.5 text-slate-900" />
          </div>
          <div>
            <div className="text-white font-bold text-[10px]">Bulletin de Notes — Trimestre 3</div>
            <div className="text-white/40 text-[7px]">Lycée Privé Malam Issa · Niamey</div>
          </div>
        </div>
        <div className="bg-amber-400/20 border border-amber-400/30 text-amber-400 text-[7px] font-bold px-2 py-1 rounded">PDF SIGNÉ</div>
      </div>

      <div className="p-3 space-y-2">
        {/* Student info */}
        <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg border border-slate-100">
          <div>
            <div className="text-slate-900 font-bold text-[10px]">Moussa Abdou</div>
            <div className="text-slate-500 text-[7px]">Classe : Terminale D · N° 4872</div>
          </div>
          <div className="text-right">
            <div className="text-emerald-600 font-black text-sm">2ème</div>
            <div className="text-slate-400 text-[7px]">rang / 38</div>
          </div>
        </div>

        {/* Notes table */}
        <div className="rounded-lg overflow-hidden border border-slate-100">
          <div className="grid grid-cols-4 bg-slate-100 px-2 py-1 text-slate-500 text-[7px] font-semibold">
            <span>Matière</span><span className="text-center">Note</span><span className="text-center">Classe</span><span className="text-right">Appréciation</span>
          </div>
          {[
            { m: 'Mathématiques', n: '18.5', moy: '11.2', a: 'Excellent', c: 'text-emerald-600' },
            { m: 'Physique-Chimie', n: '16.0', moy: '10.8', a: 'Très bien', c: 'text-blue-600' },
            { m: 'SVT', n: '15.5', moy: '12.1', a: 'Très bien', c: 'text-blue-600' },
            { m: 'Français', n: '14.0', moy: '11.5', a: 'Bien', c: 'text-purple-600' },
            { m: 'Histoire-Géo', n: '13.5', moy: '10.9', a: 'Assez bien', c: 'text-amber-600' },
          ].map((r, i) => (
            <div key={i} className={`grid grid-cols-4 px-2 py-1 items-center border-b border-slate-50 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
              <span className="text-slate-700 font-medium">{r.m}</span>
              <span className={`text-center font-black ${r.c}`}>{r.n}</span>
              <span className="text-center text-slate-400">{r.moy}</span>
              <span className={`text-right text-[7px] ${r.c}`}>{r.a}</span>
            </div>
          ))}
        </div>

        {/* Moyenne */}
        <div className="flex items-center justify-between bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg px-3 py-2">
          <div>
            <div className="text-slate-600 text-[7px] font-semibold uppercase tracking-wider">Moyenne générale</div>
            <div className="text-[7px] text-slate-500 italic mt-0.5">"Élève brillant — félicitations pour ce trimestre."</div>
          </div>
          <div className="text-2xl font-black text-emerald-600">16.2</div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center space-x-1 text-emerald-600">
            <CheckCircle2 className="w-2.5 h-2.5" />
            <span className="text-[7px] font-semibold">Généré en quelques secondes · PDF signé</span>
          </div>
          <button className="flex items-center space-x-1 bg-slate-900 text-white px-2 py-1 rounded text-[7px] font-bold">
            <Download className="w-2 h-2" /><span>PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ArchiveMockup() {
  return (
    <div className="w-full bg-slate-900 rounded-xl overflow-hidden border border-white/8 shadow-xl">
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-amber-400/10 border border-amber-400/20 rounded-lg flex items-center justify-center">
            <Archive className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="text-white font-bold text-[10px]">Dossier Numérique Élève</span>
        </div>
        <div className="flex items-center space-x-1 text-[8px] text-emerald-400">
          <Lock className="w-2.5 h-2.5" />
          <span>Sécurisé</span>
        </div>
      </div>
      <div className="p-3 space-y-2.5">
        {/* Student card */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-slate-900 font-black text-sm shadow-lg shadow-amber-400/20 shrink-0">MA</div>
          <div>
            <div className="text-white font-bold text-[11px]">Moussa Abdou</div>
            <div className="text-white/35 text-[8px]">Terminale D · Inscrit depuis Sept. 2021</div>
          </div>
          <div className="ml-auto flex items-center space-x-1 bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-[7px] px-2 py-1 rounded-full font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Actif</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { icon: FileText, val: '15', label: 'Bulletins', c: 'text-blue-400' },
            { icon: FolderOpen, val: '11', label: 'Documents', c: 'text-emerald-400' },
            { icon: CreditCard, val: '42', label: 'Paiements', c: 'text-amber-400' },
          ].map((s, i) => (
            <div key={i} className="bg-white/4 border border-white/5 rounded-xl p-2 text-center">
              <s.icon className={`w-3.5 h-3.5 mx-auto mb-1 ${s.c}`} />
              <div className={`font-black text-[13px] ${s.c}`}>{s.val}</div>
              <div className="text-white/25 text-[7px]">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Recent docs */}
        <div className="space-y-1.5">
          <div className="text-white/25 text-[8px] font-semibold uppercase tracking-wider">Documents récents</div>
          {[
            { name: 'Bulletin T3 2026.pdf', size: '92 KB', type: 'PDF', date: 'Juin 26', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
            { name: 'Acte de naissance.pdf', size: '245 KB', type: 'PDF', date: '2021', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
            { name: 'Photo identité.jpg', size: '1.2 MB', type: 'IMG', date: 'Sept 24', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
          ].map((doc, i) => (
            <div key={i} className="flex items-center justify-between bg-white/3 border border-white/5 rounded-lg px-2.5 py-1.5 hover:bg-white/6 transition-colors group">
              <div className="flex items-center space-x-2">
                <span className={`text-[7px] font-bold px-1 py-0.5 rounded border ${doc.color}`}>{doc.type}</span>
                <div>
                  <div className="text-white/65 text-[8px] font-medium truncate" style={{ maxWidth: 120 }}>{doc.name}</div>
                  <div className="text-white/20 text-[7px]">{doc.size} · {doc.date}</div>
                </div>
              </div>
              <button className="w-6 h-6 bg-amber-400/10 border border-amber-400/20 rounded-lg flex items-center justify-center group-hover:bg-amber-400/20 transition-colors">
                <Download className="w-2.5 h-2.5 text-amber-400" />
              </button>
            </div>
          ))}
        </div>

        <div className="text-center text-[8px] text-emerald-400/70 bg-emerald-400/5 border border-emerald-400/10 rounded-xl py-2">
          ✓ Archive permanente · Accessible en 30 secondes · Protégé contre la perte
        </div>
      </div>
    </div>
  );
}

function IAMockup() {
  const [step, setStep] = useState(0);
  const logs = [
    { t: '⚡', msg: 'Analyse de 487 dossiers en cours...', c: 'text-white/40' },
    { t: '⚠', msg: 'Moussa A. — 3 abs mardi × −6pts maths', c: 'text-amber-400' },
    { t: '⚠', msg: 'Halima I. — 4 devoirs non rendus · risque élevé', c: 'text-amber-400' },
    { t: '✓', msg: 'Emploi du temps T3 optimisé en 18 sec', c: 'text-emerald-400' },
    { t: '✓', msg: '47 appréciations générées automatiquement', c: 'text-blue-400' },
  ];
  useEffect(() => {
    if (step >= logs.length) return;
    const t = setTimeout(() => setStep(s => s + 1), 900);
    return () => clearTimeout(t);
  }, [step, logs.length]);
  useEffect(() => {
    const t = setTimeout(() => setStep(0), logs.length * 900 + 3000);
    return () => clearTimeout(t);
  }, [step, logs.length]);

  return (
    <div className="w-full bg-[#0a0614] border border-purple-500/15 rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 border-b border-purple-500/10 flex items-center space-x-2">
        <div className="flex space-x-1.5">
          {['#f87171','#fbbf24','#34d399'].map(c => (
            <div key={c} className="w-2.5 h-2.5 rounded-full opacity-60" style={{ background: c }} />
          ))}
        </div>
        <div className="flex items-center space-x-1.5 ml-2">
          <Cpu className="w-3 h-3 text-purple-400" />
          <span className="text-purple-400/70 text-[10px] font-mono">schoolos-ai · analyse en cours</span>
          {step < logs.length && (
            <span className="flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-purple-400" />
            </span>
          )}
        </div>
      </div>
      <div className="p-3 font-mono text-[9px] space-y-1.5" style={{ minHeight: 100 }}>
        {logs.slice(0, step).map((log, i) => (
          <div key={i} className={`flex items-start space-x-2 ${log.c} animate-slide-up`}>
            <span>{log.t}</span>
            <span>{log.msg}</span>
          </div>
        ))}
        {step < logs.length && (
          <div className="flex items-center space-x-1 text-white/20">
            <span className="animate-pulse">█</span>
          </div>
        )}
      </div>
    </div>
  );
}

function FinanceMockup() {
  return (
    <div className="space-y-2">
      {[
        { label: 'Total attendu · An 2025-2026', val: '44 165 000 FCFA', sub: null, color: 'bg-white/3 border-white/8', vColor: 'text-white' },
        { label: 'Reçu · Trimestres 1 & 2', val: '38 423 500 FCFA', sub: '87% de recouvrement', color: 'bg-emerald-500/8 border-emerald-500/15', vColor: 'text-emerald-400' },
        { label: 'Impayés · 14 familles', val: '5 741 500 FCFA', sub: 'Relances auto activées', color: 'bg-rose-500/8 border-rose-500/15', vColor: 'text-rose-400' },
      ].map((r, i) => (
        <div key={i} className={`p-3 rounded-xl border ${r.color} flex items-center justify-between`}>
          <div>
            <div className="text-white/40 text-[9px]">{r.label}</div>
            {r.sub && <div className="text-white/20 text-[8px]">{r.sub}</div>}
          </div>
          <div className={`font-black text-sm ${r.vColor}`}>{r.val}</div>
        </div>
      ))}
      <div className="bg-white/3 rounded-xl p-2.5 space-y-1.5">
        <div className="text-white/30 text-[9px] font-semibold mb-1.5">Recouvrement par mois</div>
        <div className="flex items-end space-x-1 h-10">
          {[60, 72, 58, 80, 75, 87].map((h, i) => (
            <div key={i} className="flex-1 relative">
              <div className={`absolute inset-x-0 bottom-0 rounded-sm ${i === 5 ? 'bg-emerald-400' : 'bg-white/10'}`} style={{ height: `${h}%` }} />
            </div>
          ))}
        </div>
      </div>
      <button className="w-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[9px] font-bold rounded-xl py-2 hover:bg-amber-400/20 transition-colors">
        ⚡ Envoyer 14 relances WhatsApp automatiques →
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   FAQ
───────────────────────────────────────────────────────────────────────── */
function FaqItem({ q, r }: { q: string; r: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/6 last:border-0">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left group">
        <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors pr-6">{q}</span>
        <div className={`w-5 h-5 rounded-full border border-white/15 flex items-center justify-center shrink-0 transition-all ${open ? 'border-amber-400/40 bg-amber-400/10 rotate-180' : ''}`}>
          <ChevronDown className={`w-3 h-3 ${open ? 'text-amber-400' : 'text-white/30'}`} />
        </div>
      </button>
      {open && <div className="pb-4 text-sm text-white/45 leading-relaxed -mt-1">{r}</div>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   MARQUEE logos / proof
───────────────────────────────────────────────────────────────────────── */
function TrustMarquee() {
  const items = [
    '🎓 Lycées privés', '📊 Trésorerie maîtrisée', '📱 100% mobile',
    '💳 Orange Money & Moov', '💬 Alertes WhatsApp', '🔒 Données sécurisées', '⚡ An 1 gratuit',
    '🏆 Programme Fondateurs', '📄 Bulletins en quelques secondes',
  ];
  return (
    <div className="relative overflow-hidden py-3 border-y border-white/5">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-xs text-white/25 font-medium px-6 border-r border-white/5 shrink-0">{item}</span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   SECTION TARIFS — pack complet + tableau futuriste
───────────────────────────────────────────────────────────────────────── */
const PACK_MODULES: string[] = [
  'Gestion des élèves et des inscriptions',
  'Classes, matières et enseignants',
  'Notes, moyennes et bulletins PDF',
  'Présences et absences',
  'Gestion des frais scolaires et paiements',
  'Reçus et suivi des impayés',
  'Relances parents',
  'Portail parent',
  'Communication WhatsApp',
  'Archives numériques',
  'Tableau de bord de direction',
  'Rapports et statistiques',
  'Gestion des utilisateurs et permissions',
  'Sauvegardes et sécurité des données',
  'Fonctionnalités intelligentes de SchoolOS',
];

const FOUNDER_PERKS: string[] = [
  'Accès complet à SchoolOS pendant 12 mois',
  'Configuration initiale de votre établissement',
  'Formation de vos équipes',
  'Accompagnement au lancement',
  'Support prioritaire',
  'Participation à l\'évolution de SchoolOS',
  'Statut Fondateur officiel dans votre pays',
];

function PricingSection({ placesLeft, onCandidater }: { placesLeft: number; onCandidater: () => void }) {
  const taken = PLACES_TOTAL - placesLeft;
  const pct = (taken / PLACES_TOTAL) * 100;

  return (
    <section id="tarifs" className="py-16 md:py-28 border-t border-white/5 relative overflow-hidden scroll-mt-20 md:scroll-mt-24">
      {/* Fond ambiant */}
      <div className="absolute inset-0 grid-futur opacity-60 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-amber-400/4 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* ── Header ── */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/4 border border-white/10 text-white/50 text-[11px] font-bold uppercase tracking-[0.2em] rounded-full px-4 py-2 mb-6">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Tarification claire</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Un seul pack. <span className="text-gradient-amber">Tout est inclus.</span>
          </h2>
          <p className="text-white/35 text-sm md:text-base mt-5 max-w-3xl mx-auto leading-relaxed">
            <strong className="text-white/75">Toute votre école. Un seul système.</strong>{' '}
            Élèves, inscriptions, notes, bulletins, présences, paiements, parents et administration — SchoolOS
            réunit les {PACK_MODULES.length} modules de votre établissement dans une seule plateforme pensée pour
            les écoles africaines, pour un seul abonnement annuel. La migration de vos données est offerte à
            toutes les écoles.
          </p>
        </div>

        {/* ── Comparatif des deux formules ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mb-16">

          {/* Carte 1 — Tarif public */}
          <div className="relative bg-slate-900/70 border border-white/8 rounded-[1.75rem] p-8 md:p-10 card-3d flex flex-col">
            <div className="flex items-center justify-between mb-7">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 bg-white/4 border border-white/10 rounded-2xl flex items-center justify-center">
                  <School className="w-5 h-5 text-white/40" />
                </div>
                <div>
                  <div className="text-white font-black text-lg leading-tight">SchoolOS</div>
                  <div className="text-white/25 text-xs">Tarif public</div>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/25 border border-white/10 rounded-full px-3 py-1">
                Standard
              </span>
            </div>

            <div className="flex items-end space-x-2 mb-1">
              <span className="text-5xl md:text-6xl font-black text-white leading-none tracking-tight">120 000</span>
              <span className="text-white/40 font-bold text-base pb-2">FCFA / an</span>
            </div>
            <div className="text-amber-400/70 font-bold text-sm mb-7">Tout est inclus.</div>

            <div className="space-y-3 mb-8 flex-1">
              {[
                'Les 15 modules de la plateforme',
                'Jusqu\'à 500 élèves par établissement',
                'Migration de vos données incluse',
                'Bulletins PDF, reçus et archives',
                'Portail parent : notes, absences et paiements sur le téléphone des parents',
                'Mises à jour et sécurité des données',
              ].map((f, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <Check className="w-4 h-4 text-white/30 shrink-0 mt-0.5" />
                  <span className="text-white/45 text-sm leading-snug">{f}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/6 pt-5 mb-6 space-y-2.5">
              {[
                ['Modules à acheter séparément', 'Aucun'],
                ['Frais d\'installation', 'Aucun'],
                ['Frais cachés', 'Aucun'],
              ].map(([l, v], i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-white/30">{l}</span>
                  <span className="text-emerald-400 font-bold">{v}</span>
                </div>
              ))}
            </div>

            <button onClick={onCandidater}
              className="w-full flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 font-bold py-4 rounded-2xl transition-all text-sm">
              <span>Demander une démonstration</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Carte 2 — Programme Fondateur 2026 */}
          <div className="price-border-anim price-scanline">
            <div className="relative h-full bg-gradient-to-br from-[#140e05] via-[#0b0a12] to-[#0b1220] rounded-[1.75rem] p-8 md:p-10 flex flex-col overflow-hidden">
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-400/10 blur-[90px] rounded-full pointer-events-none" />

              <div className="relative flex items-start justify-between gap-4 mb-7">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 bg-amber-400 rounded-2xl flex items-center justify-center glow-amber shrink-0">
                    <Crown className="w-5 h-5 text-slate-900" />
                  </div>
                  <div>
                    <div className="text-white font-black text-lg leading-tight">Programme Fondateur 2026</div>
                    <div className="text-amber-400/60 text-xs">{PLACES_TOTAL} établissements seulement</div>
                  </div>
                </div>
                <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-wider text-slate-900 bg-amber-400 rounded-full px-3 py-1 shrink-0">
                  Offre limitée
                </span>
              </div>

              <div className="relative text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2">
                Première année
              </div>
              <div className="relative flex items-end space-x-4 mb-4 flex-wrap">
                <span className="text-5xl md:text-6xl font-black text-gradient-amber leading-none tracking-tight">0 FCFA</span>
                <div className="pb-1">
                  <div className="text-white/30 text-sm line-through decoration-rose-400/50">120 000 FCFA</div>
                  <div className="text-emerald-400 font-bold text-xs">Soit 120 000 FCFA économisés</div>
                </div>
              </div>

              <div className="relative flex items-start space-x-2.5 bg-amber-400/8 border border-amber-400/20 rounded-xl px-4 py-3.5 mb-7">
                <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-amber-400 text-xs font-bold leading-relaxed">
                  60 000 FCFA / an après la première année — tarif Fondateur garanti pendant toute la durée de votre abonnement.
                </span>
              </div>

              <div className="relative text-[11px] font-bold text-amber-400/70 uppercase tracking-[0.15em] mb-4">
                Ce que comprend la première année
              </div>
              <div className="relative space-y-2.5 mb-8 flex-1">
                {FOUNDER_PERKS.map((f, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-white/60 text-sm leading-snug">{f}</span>
                  </div>
                ))}
                <div className="flex items-start space-x-3 bg-amber-400/5 border border-amber-400/15 rounded-xl px-3 py-2.5 row-pulse">
                  <Crown className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span className="text-white/70 text-sm leading-snug">
                    <strong className="text-amber-400">Tarif Fondateur 60 000 FCFA / an</strong> — garanti après la première année
                  </span>
                </div>
              </div>

              <div className="relative mb-6">
                <div className="flex items-center justify-between text-[11px] mb-2">
                  <span className="text-white/30 font-bold uppercase tracking-wider">Places attribuées</span>
                  <span className="text-amber-400 font-black font-mono">{taken} / {PLACES_TOTAL}</span>
                </div>
                <div className="w-full bg-white/6 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-400 to-orange-400 h-2 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }} />
                </div>
                <p className="text-white/25 text-[11px] mt-2">
                  Une fois les {PLACES_TOTAL} places attribuées, le Programme Fondateur 2026 ferme définitivement.
                </p>
              </div>

              <div className="relative bg-emerald-400/6 border border-emerald-400/15 rounded-xl px-4 py-3 mb-6 flex items-center space-x-2.5">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-emerald-400 text-xs font-bold">Aucun engagement financier pendant la première année.</span>
              </div>

              <button onClick={onCandidater}
                className="relative w-full flex items-center justify-center space-x-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black py-4 rounded-2xl transition-all text-sm glow-amber hover:glow-amber-strong hover:scale-[1.01]">
                <Rocket className="w-4 h-4" />
                <span>Devenir établissement Fondateur</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          </div>

        </div>

        {/* ── Tableau futuriste : module par module ── */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center space-x-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>Comparatif détaillé · module par module</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white mt-4">Chaque ligne. Déjà incluse.</h3>
          <p className="text-white/30 text-sm mt-2 max-w-xl mx-auto">
            Aucune case vide, aucune option payante. Le Programme Fondateur ajoute des services, jamais des limitations.
          </p>
        </div>

        <div className="price-border-anim">
          <div className="bg-[#080b12]/90 rounded-[1.75rem] overflow-hidden">

            {/* En-tête du tableau */}
            <div className="grid grid-cols-[minmax(0,1fr)_76px_92px] sm:grid-cols-[minmax(0,1fr)_150px_180px] items-center gap-2 px-4 sm:px-7 py-4 bg-white/3 border-b border-white/8">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] text-white/25">
                Fonctionnalité
              </span>
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] text-white/25 text-center">
                Standard
              </span>
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] text-amber-400 text-center">
                Fondateur
              </span>
            </div>

            {/* Lignes : les 15 modules du pack */}
            {PACK_MODULES.map((m, i) => (
              <div key={i}
                className="group grid grid-cols-[minmax(0,1fr)_76px_92px] sm:grid-cols-[minmax(0,1fr)_150px_180px] items-center gap-2 px-4 sm:px-7 py-3 border-b border-white/4 last:border-0 hover:bg-white/3 transition-colors relative">
                <div className="absolute left-0 top-0 bottom-0 w-px bg-amber-400/0 group-hover:bg-amber-400/60 transition-colors" />
                <div className="flex items-center space-x-3 min-w-0">
                  <span className="hidden sm:inline-block font-mono text-[10px] text-white/15 shrink-0 w-6">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-white/55 group-hover:text-white/80 text-[12px] sm:text-sm font-medium leading-snug transition-colors">
                    {m}
                  </span>
                </div>
                <div className="flex justify-center">
                  <Check className="w-4 h-4 text-emerald-400/60" />
                </div>
                <div className="flex justify-center">
                  <Check className="w-4 h-4 text-amber-400" />
                </div>
              </div>
            ))}

            {/* Ligne 16 — service offert à TOUTES les écoles */}
            <div className="grid grid-cols-[minmax(0,1fr)_76px_92px] sm:grid-cols-[minmax(0,1fr)_150px_180px] items-center gap-2 px-4 sm:px-7 py-3 bg-emerald-400/4 border-b border-emerald-400/10">
              <div className="flex items-center space-x-3 min-w-0">
                <span className="hidden sm:inline-block font-mono text-[10px] text-emerald-400/40 shrink-0 w-6">16</span>
                <span className="text-white/60 text-[12px] sm:text-sm font-medium leading-snug">
                  Migration de vos données
                  <span className="ml-2 inline-block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/8 border border-emerald-400/15 rounded-full px-2 py-0.5">
                    offerte à tous
                  </span>
                </span>
              </div>
              <div className="flex justify-center"><Check className="w-4 h-4 text-emerald-400" /></div>
              <div className="flex justify-center"><Check className="w-4 h-4 text-amber-400" /></div>
            </div>

            {/* Séparateur : avantages réservés aux Fondateurs */}
            <div className="flex items-center space-x-3 px-4 sm:px-7 py-3.5 bg-amber-400/6 border-y border-amber-400/15">
              <Crown className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-amber-400 font-black text-[10px] sm:text-xs uppercase tracking-[0.18em]">
                Avantages réservés aux Fondateurs
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-amber-400/30 to-transparent" />
            </div>

            {[
              { l: 'Configuration initiale de l\'établissement', s: 'Non', f: 'Incluse' },
              { l: 'Formation de vos équipes', s: 'Non', f: 'Incluse' },
              { l: 'Accompagnement au lancement', s: 'Non', f: 'Inclus' },
              { l: 'Participation à l\'évolution de SchoolOS', s: 'Non', f: 'Oui' },
              { l: 'Support prioritaire', s: 'Non', f: 'Offert' },
              { l: 'Première année d\'abonnement', s: '120 000 FCFA', f: '0 FCFA' },
              { l: 'Tarif annuel après la 1ère année', s: '120 000 FCFA', f: '60 000 FCFA' },
              { l: 'Tarif garanti pendant l\'abonnement', s: 'Non', f: 'Garanti' },
            ].map((r, i) => (
              <div key={i}
                className="grid grid-cols-[minmax(0,1fr)_76px_92px] sm:grid-cols-[minmax(0,1fr)_150px_180px] items-center gap-2 px-4 sm:px-7 py-3 border-b border-white/4 last:border-0 hover:bg-white/3 transition-colors">
                <span className="text-white/55 text-[12px] sm:text-sm font-medium leading-snug">{r.l}</span>
                <span className="text-center text-white/20 font-mono text-[10px] sm:text-xs">{r.s}</span>
                <span className="text-center text-amber-400 font-black text-[10px] sm:text-xs bg-amber-400/8 border border-amber-400/15 rounded-lg py-1.5 px-1">
                  {r.f}
                </span>
              </div>
            ))}

          </div>
        </div>

        {/* ── Notes du pack ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
          {[
            { Icon: Users, t: 'Jusqu\'à 500 élèves', d: 'par établissement, sans supplément' },
            { Icon: Layers, t: 'Aucun module séparé', d: 'les 15 modules sont dans le pack' },
            { Icon: Lock, t: 'Aucun frais caché', d: 'un seul prix annuel, tout compris' },
          ].map((n, i) => (
            <div key={i} className="flex items-start space-x-3 bg-white/3 border border-white/8 rounded-2xl px-5 py-4 card-3d">
              <n.Icon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-white/75 font-bold text-sm">{n.t}</div>
                <div className="text-white/25 text-xs mt-0.5">{n.d}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button onClick={onCandidater}
            className="inline-flex items-center space-x-2 text-white/40 hover:text-amber-400 text-sm font-bold transition-colors">
            <span>Rejoindre le Programme Fondateur 2026</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   SECTION WRAPPER with reveal animation
───────────────────────────────────────────────────────────────────────── */
function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, 0.1);
  return (
    <div ref={ref} className={`section-reveal ${visible ? 'visible' : ''} ${className}`}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   MAIN
───────────────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate();
  const onDeck = () => navigate('/presentation');

  const [pioneers, setPioneers] = useState<{ name: string; school: string; country: string; students?: string }[]>(() => {
    const s = localStorage.getItem('schoolos_founders_v3');
    return s ? JSON.parse(s) : [
      { name: "M. Moussa Issoufou", school: "Complexe Scolaire Sahel", country: "Niger" },
      { name: "Mme Fatouma Maïga", school: "Institut Privé Ibn Battouta", country: "Niger" },
    ];
  });

  /** Candidatures réellement enregistrées dans Google Sheets (compteur partagé entre tous les visiteurs) */
  const [sheetCount, setSheetCount] = useState<number | null>(null);
  /** Numéro de Fondateur renvoyé par la feuille pour cette candidature */
  const [ticket, setTicket] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');

  /** Nombre de places prises : la feuille fait foi si elle en compte davantage que l'appareil */
  const foundersCount = Math.max(pioneers.length, sheetCount ?? 0);
  const placesLeft = PLACES_TOTAL - foundersCount;

  /** Liste affichée : candidatures connues localement + places prises côté Sheets (anonymisées) */
  const foundersList = (() => {
    if (foundersCount <= pioneers.length) return pioneers;
    const list = [...pioneers];
    for (let i = list.length; i < foundersCount; i++) {
      list.push({
        name: 'Candidature enregistrée',
        school: `Établissement Fondateur #${String(i + 1).padStart(2, '0')}`,
        country: '—',
      });
    }
    return list;
  })();

  /** Référence affichée sur l'écran de confirmation (numéro de la feuille si disponible) */
  const founderRef = String(ticket ?? foundersCount).padStart(2, '0');

  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [whatsapp, setWhatsapp] = useState(NIGER_PREFIX);
  const [email, setEmail] = useState('');
  const [students, setStudents] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const statsVisible = useInView(statsRef);

  const typeText = useTypewriter([
    'Un seul système.',
    'Un seul logiciel.',
    'Un seul abonnement.',
    'Un seul endroit.',
  ], 55, 2200);

  // Nombre de candidatures déjà dans la feuille Google Sheets (places restantes réelles)
  useEffect(() => {
    let alive = true;
    fetchCandidatureCount().then((count) => {
      if (alive && count !== null) setSheetCount(count);
    });
    return () => { alive = false; };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;

    setSending(true);
    setSendError('');

    // Enregistrement dans Google Sheets via Apps Script
    // Numéro WhatsApp complet ? (8 chiffres après le préfixe +227)
    if (!isCompleteNigerNumber(whatsapp)) {
      setSending(false);
      setSendError('Numéro WhatsApp incomplet : saisissez les 8 chiffres après +227 (ex. +227 87 72 75 01).');
      return;
    }

    const result = await sendCandidature({
      name: name.trim(),
      school: school.trim(),
      whatsapp: whatsapp.trim(),
      email: email.trim(),
      students: students || 'non précisé',
      country: 'Niger',
      source: 'landing',
    });

    setSending(false);

    if (!result.ok) {
      setSendError(
        result.error === 'Failed to fetch'
          ? "Connexion impossible au serveur d'enregistrement. Vérifiez votre réseau puis réessayez."
          : "Votre candidature n'a pas pu être enregistrée. Merci de réessayer dans un instant."
      );
      return;
    }

    setTicket(result.number ?? foundersCount + 1);

    const p = { name, school, country: 'Niger', students };
    const list = [p, ...pioneers];
    setPioneers(list);
    localStorage.setItem('schoolos_founders_v3', JSON.stringify(list));
    setSubmitted(true);
  };

  const inp = "w-full bg-white/4 border border-white/8 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-amber-400/50 focus:bg-white/6 focus:ring-2 focus:ring-amber-400/8 transition-all";

  return (
    <div className="min-h-screen bg-[#06090f] text-white overflow-x-clip noise-overlay">

      {/* ══ NAVBAR ═════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-[#06090f]/90 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <button onClick={() => scrollTo('hero')} className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 bg-amber-400 rounded-xl flex items-center justify-center glow-amber group-hover:scale-110 transition-transform">
              <School className="w-4 h-4 text-slate-900" />
            </div>
            <span className="font-black text-white text-base tracking-tight">School<span className="text-amber-400">OS</span></span>
            <span className="hidden sm:block text-[10px] text-white/20 border border-white/10 px-2 py-0.5 rounded-full font-medium">by SmartLimb</span>
          </button>

          <nav className="hidden md:flex items-center space-x-1">
            {[['solution','Produit'],['tarifs','Tarifs'],['fondateurs','Programme'],['pourquoi','Pourquoi']].map(([id,label]) => (
              <button key={id} onClick={() => scrollTo(id)}
                className="px-4 py-2 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/5 transition-all text-sm font-medium">
                {label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 bg-amber-400/8 border border-amber-400/15 rounded-full px-3 py-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400" />
              </span>
              <span>{placesLeft} place{placesLeft > 1 ? 's' : ''} restante{placesLeft > 1 ? 's' : ''}</span>
            </div>
            <button onClick={onDeck} className="flex items-center space-x-1.5 text-sm text-white/30 hover:text-white/70 transition-colors">
              <Eye className="w-3.5 h-3.5" />
              <span>Présentation</span>
            </button>
            <button onClick={() => scrollTo('candidature')}
              className="flex items-center space-x-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black px-4 py-2.5 rounded-xl text-sm transition-all glow-amber hover:glow-amber-strong">
              <span>Candidater</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors">
            {menuOpen ? <X className="w-5 h-5 text-white/60" /> : (
              <div className="space-y-1.5">{[0,1,2].map(i => <div key={i} className="w-5 h-0.5 bg-white/50 rounded" />)}</div>
            )}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#06090f] px-4 py-3 space-y-1">
            {[['solution','Produit'],['tarifs','Tarifs & pack'],['fondateurs','Programme'],['pourquoi','Pourquoi SchoolOS ?'],['candidature','Candidater']].map(([id,label]) => (
              <button key={id} onClick={() => scrollTo(id)} className="w-full text-left text-sm text-white/50 py-2.5 px-3 rounded-lg hover:bg-white/5">{label}</button>
            ))}
            <div className="pt-2 border-t border-white/5">
              <button onClick={onDeck} className="w-full text-left text-sm text-white/30 py-2.5 px-3 rounded-lg hover:bg-white/5 flex items-center space-x-2">
                <Eye className="w-4 h-4" /><span>Présentation complète</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ══ HERO ═══════════════════════════════════════════════════════════ */}
      <section id="hero" ref={heroRef} className="relative min-h-screen flex flex-col justify-center overflow-hidden hero-grid">
        {/* Ambient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-amber-400/4 rounded-full blur-[120px] pointer-events-none animate-orb" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/4 rounded-full blur-[100px] pointer-events-none animate-orb-delay" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/2 rounded-full blur-[160px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-20 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left — text */}
            <div>
              {/* Urgency badge */}
              <div className="inline-flex items-center space-x-2 bg-amber-400/8 border border-amber-400/15 text-amber-400 text-xs font-bold rounded-full px-4 py-2 mb-7 animate-slide-up">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400" />
                </span>
                <span>Programme Fondateurs 2026 · {placesLeft} place{placesLeft > 1 ? 's' : ''} sur {PLACES_TOTAL}</span>
                <ArrowRight className="w-3 h-3" />
              </div>

              {/* Headline — promesse principale */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[0.95] mb-6 animate-slide-up-delay-1">
                <span className="text-white">Toute votre école.</span>
                <br />
                <span className="text-gradient-amber">{typeText}</span>
                <span className="inline-block w-0.5 h-9 sm:h-11 bg-amber-400 ml-1 align-middle" style={{ animation: 'blink 1s step-end infinite' }} />
              </h1>

              {/* Quoi ? Pour qui ? Pourquoi maintenant ? — répondu immédiatement */}
              <p className="text-lg text-white/40 leading-relaxed mb-8 max-w-lg animate-slide-up-delay-2">
                <strong className="text-white/75">Gérez toute votre école depuis un seul endroit.</strong>{' '}
                Élèves, inscriptions, notes, bulletins, présences, paiements, parents et administration —
                SchoolOS centralise votre gestion scolaire dans une seule plateforme, pensée pour les
                établissements africains.{' '}
                <strong className="text-amber-400/90">Pourquoi maintenant ?</strong> Le Programme Fondateur 2026
                offre la première année aux {PLACES_TOTAL} premiers établissements.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-10 animate-slide-up-delay-3">
                <button onClick={() => scrollTo('candidature')}
                  className="group flex items-center justify-center space-x-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black px-7 py-4 rounded-xl text-sm transition-all glow-amber hover:glow-amber-strong hover:scale-[1.02]">
                  <Rocket className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  <span>Rejoindre le Programme Fondateurs</span>
                </button>
                <button onClick={onDeck}
                  className="group flex items-center justify-center space-x-2 bg-white/4 hover:bg-white/8 border border-white/8 hover:border-white/15 text-white/60 hover:text-white px-6 py-4 rounded-xl text-sm transition-all font-medium">
                  <Play className="w-3.5 h-3.5" />
                  <span>Voir la présentation</span>
                </button>
              </div>

              {/* Social proof */}
              <div className="flex flex-wrap items-center gap-5 animate-slide-up-delay-4">
                <div className="flex items-center space-x-2.5">
                  <div className="flex -space-x-2.5">
                    {['MI','FM','AB'].map((init, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 border-2 border-[#06090f] flex items-center justify-center text-white text-[9px] font-black">{init}</div>
                    ))}
                  </div>
                  <div className="text-xs text-white/35">
                    <strong className="text-white/70">{PLACES_TOTAL - placesLeft} établissements</strong>
                    <br />déjà Fondateurs
                  </div>
                </div>
                <div className="w-px h-8 bg-white/8 hidden sm:block" />
                <div className="flex items-center space-x-2 text-xs text-white/30">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Données chiffrées<br />100% sécurisées</span>
                </div>
                <div className="w-px h-8 bg-white/8 hidden sm:block" />
                <div className="flex items-center space-x-2 text-xs text-white/30">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>0 FCFA<br />en année 1</span>
                </div>
              </div>
            </div>

            {/* Right — dashboard mockup */}
            <div className="relative animate-slide-up-delay-2">
              {/* Glow behind dashboard */}
              <div className="absolute inset-0 bg-amber-400/5 blur-3xl rounded-3xl scale-110" />

              <div className="relative animate-float-slow">
                <LiveDashboard />
              </div>

              {/* Floating phone (parent) */}
              <div className="absolute -left-12 top-12 hidden lg:block animate-float" style={{ animationDelay: '1s' }}>
                <div className="transform -rotate-6 shadow-2xl">
                  <PhoneMockup type="parent" />
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 hidden md:flex items-center space-x-2 bg-emerald-400/10 border border-emerald-400/20 backdrop-blur-xl rounded-2xl p-3 shadow-lg animate-float" style={{ animationDelay: '2s' }}>
                <div className="w-8 h-8 bg-emerald-400/15 border border-emerald-400/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-emerald-400 font-black text-sm">SMS auto</div>
                  <div className="text-white/30 text-[9px]">relance parents</div>
                </div>
              </div>

              {/* Floating badge 2 */}
              <div className="absolute -top-4 -right-6 hidden md:flex items-center space-x-2 bg-slate-900 border border-white/8 backdrop-blur-xl rounded-2xl p-3 shadow-lg animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="w-8 h-8 bg-blue-400/15 border border-blue-400/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="text-blue-400 font-black text-sm">100%</div>
                  <div className="text-white/30 text-[9px]">bulletins traçables</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 text-white/20 animate-bounce">
          <span className="text-xs">Découvrir</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

      {/* ══ MARQUEE ════════════════════════════════════════════════════════ */}
      <TrustMarquee />

      {/* ══ STATS ══════════════════════════════════════════════════════════ */}
      <section ref={statsRef} className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { Icon: TrendingUp, label: 'Trésorerie suivie en temps réel', sub: 'recouvrement, impayés et alertes sur un seul écran', color: 'text-emerald-400', bg: 'from-emerald-500/8 to-transparent', border: 'border-emerald-500/12' },
              { Icon: BookOpen, label: 'Bulletins générés en quelques secondes', sub: 'au lieu de plusieurs semaines de calculs manuels', color: 'text-amber-400', bg: 'from-amber-500/8 to-transparent', border: 'border-amber-500/12' },
              { Icon: Smartphone, label: 'Parents informés par SMS & WhatsApp', sub: 'notes, absences et paiements — sans application à installer', color: 'text-blue-400', bg: 'from-blue-500/8 to-transparent', border: 'border-blue-500/12' },
              { Icon: Archive, label: 'Dossiers élèves conservés à vie', sub: 'consultables en quelques clics, même après la sortie', color: 'text-purple-400', bg: 'from-purple-500/8 to-transparent', border: 'border-purple-500/12' },
            ].map((s, i) => (
              <div key={i} className={`bg-gradient-to-b ${s.bg} border ${s.border} rounded-2xl p-6 text-center card-3d`}>
                <div className={`inline-flex p-3 rounded-xl bg-white/3 border border-white/6 mb-4`}>
                  <s.Icon className={`w-6 h-6 ${s.color}`} />
                </div>
                <div className="text-white/70 text-sm font-bold leading-snug">{s.label}</div>
                <div className="text-white/25 text-xs mt-2 leading-relaxed">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PROBLÈME ═══════════════════════════════════════════════════════ */}
      <RevealSection>
        <section id="probleme" className="py-16 md:py-24 border-t border-white/5 scroll-mt-20 md:scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-14">
              <span className="text-xs font-bold text-rose-400/60 uppercase tracking-[0.15em]">Le problème</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mt-3 mb-4 tracking-tight">
                Votre école <span className="text-rose-400">perd</span> chaque semaine.
                <br />Sans jamais l'avoir mesuré.
              </h2>
              <p className="text-white/35 max-w-xl mx-auto text-sm sm:text-base">
                Ces 4 problèmes ne sont pas des inconvénients opérationnels. Ce sont des fuites financières silencieuses et des risques réputationnels qui coûtent des élèves.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  Icon: CreditCard, color: 'rose',
                  n: '01',
                  title: 'Le cash non tracé',
                  desc: 'Paiements au portail, en enveloppe, en plusieurs fois. Sans enregistrement systématique, une partie des frais échappe à tout suivi. Vous le constatez en fin d\'année — trop tard pour agir.',
                  stat: 'Revenus difficiles à suivre',
                },
                {
                  Icon: Clock, color: 'orange',
                  n: '02',
                  title: 'Les bulletins à la main',
                  desc: 'Excel par enseignant, recopie par la secrétaire, vérification par la direction. Des semaines de travail par trimestre pour un résultat souvent en retard et plein d\'erreurs.',
                  stat: 'Des semaines de calculs manuels',
                },
                {
                  Icon: Users, color: 'amber',
                  n: '03',
                  title: 'Les parents dans le noir',
                  desc: 'Ils apprennent que leur enfant a 7/20... au bulletin. Trop tard pour agir. Cette frustration se transforme en départ — et en mauvais bouche-à-oreille.',
                  stat: 'Chaque départ coûte cher',
                },
                {
                  Icon: Archive, color: 'slate',
                  n: '04',
                  title: 'Les dossiers papier perdus',
                  desc: 'Inondation. Déménagement. Dossier introuvable. Chaque document perdu est une inscription recommencée, des parents agacés, une image d\'école non professionnelle.',
                  stat: 'Mémoire institutionnelle = zéro',
                },
              ].map((p, i) => (
                <div key={i}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`relative p-6 bg-white/2 border rounded-2xl transition-all duration-300 cursor-default overflow-hidden ${hoveredCard === i ? 'border-rose-500/30 bg-rose-500/3 -translate-y-1' : 'border-white/6 hover:border-white/12'}`}>
                  {/* Number */}
                  <div className="text-[80px] font-black text-white/3 absolute -right-2 -top-4 leading-none select-none">{p.n}</div>
                  <div className={`inline-flex p-2.5 rounded-xl mb-4 bg-${p.color}-500/10 border border-${p.color}-500/15`}>
                    <p.Icon className={`w-5 h-5 text-${p.color}-400`} />
                  </div>
                  <h3 className="text-white font-bold text-base mb-2">{p.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed mb-4">{p.desc}</p>
                  <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-rose-400 bg-rose-400/8 border border-rose-400/15 px-3 py-1.5 rounded-full">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{p.stat}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ══ SOLUTION — BENTO ═══════════════════════════════════════════════ */}
      <RevealSection>
        <section id="solution" className="py-16 md:py-28 border-t border-white/5 scroll-mt-20 md:scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-14">
              <span className="text-xs font-bold text-amber-400/50 uppercase tracking-[0.15em]">La solution</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mt-3 mb-4 tracking-tight">
                Un système. Toute l'école.
                <br /><span className="text-gradient-amber">Chaque acteur à sa place.</span>
              </h2>
              <p className="text-white/35 max-w-xl mx-auto text-sm sm:text-base">
                SchoolOS n'est pas un logiciel de plus. C'est l'infrastructure numérique complète de votre établissement : 100% mobile, paiements locaux (Orange Money, Moov, espèces tracées), alertes WhatsApp — et données sécurisées.
              </p>
            </div>

            {/* BENTO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

              {/* 1. Dashboard — grande carte */}
              <div className="lg:col-span-2 bg-slate-900 border border-white/6 rounded-2xl p-6 overflow-hidden animate-shimmer hover:border-amber-400/15 transition-all duration-300 group card-3d">
                <div className="mb-5">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-amber-400/10 border border-amber-400/20 rounded-lg flex items-center justify-center">
                      <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <span className="text-xs font-bold text-white/25 uppercase tracking-wider">Direction & Admin</span>
                  </div>
                  <h3 className="text-xl font-black text-white">Pilotez avec de vraies données</h3>
                  <p className="text-white/35 text-sm mt-1">Trésorerie en direct, impayés, alertes IA — un seul tableau de bord remplace vos 5 fichiers Excel.</p>
                </div>
                <LiveDashboard />
              </div>

              {/* 2. Bulletins */}
              <div className="bg-slate-900 border border-white/6 rounded-2xl p-5 overflow-hidden hover:border-blue-400/20 transition-all duration-300 card-3d">
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-blue-400/10 border border-blue-400/20 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <span className="text-xs font-bold text-white/25 uppercase tracking-wider">Académique</span>
                  </div>
                  <h3 className="text-lg font-black text-white">Bulletin en quelques secondes</h3>
                  <p className="text-white/35 text-xs mt-1">Notes saisies sur mobile → PDF signé automatiquement, prêt à imprimer.</p>
                </div>
                <BulletinMockup />
              </div>

              {/* 3. Portail parent */}
              <div className="bg-slate-900 border border-white/6 rounded-2xl p-5 flex flex-col hover:border-emerald-400/20 transition-all duration-300 card-3d">
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-emerald-400/10 border border-emerald-400/20 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <span className="text-xs font-bold text-white/25 uppercase tracking-wider">Parents</span>
                  </div>
                  <h3 className="text-lg font-black text-white">Portail parent 24h/24</h3>
                  <p className="text-white/35 text-xs mt-1">Notes, absences, paiements et informations scolaires accessibles depuis leur téléphone. Aucune application à installer.</p>
                </div>
                <div className="flex-1 flex items-center justify-center py-2">
                  <PhoneMockup type="parent" />
                </div>
              </div>

              {/* 4. Enseignant */}
              <div className="bg-slate-900 border border-white/6 rounded-2xl p-5 flex flex-col hover:border-purple-400/20 transition-all duration-300 card-3d">
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-purple-400/10 border border-purple-400/20 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <span className="text-xs font-bold text-white/25 uppercase tracking-wider">Enseignants</span>
                  </div>
                  <h3 className="text-lg font-black text-white">Appel en 3 taps</h3>
                  <p className="text-white/35 text-xs mt-1">Adopté le jour même. Pensé pour les enseignants qui travaillent souvent dans plusieurs établissements.</p>
                </div>
                <div className="flex-1 flex items-center justify-center py-2">
                  <PhoneMockup type="teacher" />
                </div>
              </div>

              {/* 5. Archive — grande carte */}
              <div className="md:col-span-2 bg-slate-900 border border-white/6 rounded-2xl p-6 hover:border-rose-400/15 transition-all duration-300 card-3d">
                <div className="mb-5">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-rose-400/10 border border-rose-400/20 rounded-lg flex items-center justify-center">
                      <Archive className="w-3.5 h-3.5 text-rose-400" />
                    </div>
                    <span className="text-xs font-bold text-white/25 uppercase tracking-wider">Secrétariat & Archives</span>
                  </div>
                  <h3 className="text-xl font-black text-white">Zéro document perdu. À vie.</h3>
                  <p className="text-white/35 text-sm mt-1">Chaque élève a un dossier numérique permanent. Retrouvez n'importe quel bulletin en 30 secondes — même 5 ans après sa sortie.</p>
                </div>
                <ArchiveMockup />
              </div>

              {/* 6. IA */}
              <div className="bg-gradient-to-br from-[#0a0614] to-[#0e0920] border border-purple-500/15 rounded-2xl p-6 hover:border-purple-400/30 transition-all duration-300 card-3d">
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-purple-400/10 border border-purple-500/20 rounded-lg flex items-center justify-center">
                      <Cpu className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <span className="text-xs font-bold text-purple-400/40 uppercase tracking-wider">Intelligence Artificielle</span>
                    <span className="text-[8px] bg-purple-500/10 border border-purple-500/20 text-purple-400/60 px-1.5 py-0.5 rounded-full">Phase 3</span>
                  </div>
                  <h3 className="text-lg font-black text-white">Détection du décrochage avant qu'il arrive</h3>
                  <p className="text-white/35 text-xs mt-1 mb-4">L'IA croise absences, notes et comportements, et recommande une action immédiate — avant que la situation ne s'aggrave.</p>
                </div>
                <IAMockup />
              </div>

              {/* 7. Finance */}
              <div className="md:col-span-1 bg-slate-900 border border-white/6 rounded-2xl p-6 hover:border-amber-400/20 transition-all duration-300 card-3d">
                <div className="mb-5">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-amber-400/10 border border-amber-400/20 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <span className="text-xs font-bold text-white/25 uppercase tracking-wider">Trésorerie</span>
                  </div>
                  <h3 className="text-lg font-black text-white">Chaque FCFA tracé</h3>
                  <p className="text-white/35 text-xs mt-1">Reçus PDF, relances WhatsApp, tableau de bord en direct.</p>
                </div>
                <FinanceMockup />
              </div>
            </div>

          </div>
        </section>
      </RevealSection>

      {/* ══ TARIFS ═════════════════════════════════════════════════════════ */}
      <RevealSection>
        <PricingSection placesLeft={placesLeft} onCandidater={() => scrollTo('candidature')} />
      </RevealSection>

      {/* ══ PROGRAMME FONDATEURS ═══════════════════════════════════════════ */}
      <RevealSection>
        <section id="fondateurs" className="py-16 md:py-28 border-t border-white/5 relative overflow-hidden scroll-mt-20 md:scroll-mt-24">
          {/* Background accent */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-amber-400/2 blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
              {/* Left */}
              <div>
                <div className="inline-flex items-center space-x-2 bg-amber-400/8 border border-amber-400/15 text-amber-400 text-xs font-bold rounded-full px-3 py-1.5 mb-6">
                  <Award className="w-3.5 h-3.5" />
                  <span>Programme exclusif · 20 établissements maximum</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-5">
                  Vous ne serez pas simplement<br />un client.
                  <br /><span className="text-gradient-amber">Vous participerez<br />à la construction de SchoolOS.</span>
                </h2>
                <p className="text-white/40 text-base leading-relaxed mb-8 max-w-md">
                  Nous sélectionnons 20 établissements visionnaires pour co-construire avec nous les standards scolaires du continent africain. Ce programme ferme définitivement dès la 20ème place comblée.
                </p>

                {/* Avantages */}
                <div className="space-y-2.5 mb-8">
                  {[
                    { Icon: Zap, color: 'amber', t: '12 mois 100% gratuits', d: 'Accès complet · zéro FCFA en an 1 · aucun engagement' },
                    { Icon: Settings, color: 'blue', t: 'Configuration initiale incluse', d: 'Votre établissement paramétré : classes, matières et personnels' },
                    { Icon: Star, color: 'emerald', t: '60 000 FCFA/an après l\'an 1', d: 'Tarif Fondateur garanti pendant votre abonnement — moitié du tarif public' },
                    { Icon: GraduationCap, color: 'purple', t: 'Formation 2h incluse', d: '100% de vos équipes opérationnelles dès le 1er jour' },
                    { Icon: Target, color: 'rose', t: 'Co-construction produit', d: 'Vos besoins guident notre roadmap — vous façonnez l\'outil' },
                  ].map((a, i) => (
                    <div key={i} className={`flex items-center space-x-4 p-4 rounded-xl bg-white/2 border border-white/5 hover:border-${a.color}-400/20 hover:bg-${a.color}-400/3 transition-all duration-200 group cursor-default`}>
                      <div className={`w-10 h-10 rounded-xl bg-${a.color}-400/8 border border-${a.color}-400/15 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                        <a.Icon className={`w-4.5 h-4.5 text-${a.color}-400`} />
                      </div>
                      <div>
                        <div className="text-white font-bold text-sm">{a.t}</div>
                        <div className="text-white/30 text-xs mt-0.5">{a.d}</div>
                      </div>
                      <Check className="w-4 h-4 text-white/15 ml-auto shrink-0 group-hover:text-emerald-400 transition-colors" />
                    </div>
                  ))}
                </div>

                {/* Timeline */}
                <div className="space-y-0">
                  <div className="text-xs font-bold text-white/20 uppercase tracking-wider mb-4">Ce qui se passe après votre candidature</div>
                  {[
                    { n: '01', t: 'Candidature', d: '60 secondes · aucun engagement', c: 'border-amber-400/30 text-amber-400' },
                    { n: '02', t: 'Appel de qualification', d: '30 min · présentation si souhaité · lettre d\'intention', c: 'border-blue-400/30 text-blue-400' },
                    { n: '03', t: 'Rentrée transformée', d: 'Migration · formation · déploiement Juil–Sept 2026', c: 'border-emerald-400/30 text-emerald-400' },
                  ].map((s, i) => (
                    <div key={i} className="flex items-start space-x-4 relative pb-5">
                      {i < 2 && <div className="absolute left-4 top-8 bottom-0 w-px bg-white/5" />}
                      <div className={`w-8 h-8 rounded-xl border ${s.c} flex items-center justify-center shrink-0 font-mono font-black text-xs`}>{s.n}</div>
                      <div className="pt-1">
                        <div className="text-white/80 font-bold text-sm">{s.t}</div>
                        <div className="text-white/25 text-xs">{s.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right */}
              <div className="space-y-4">
                {/* Giant counter */}
                <div className="bg-gradient-to-br from-amber-400 to-orange-400 rounded-3xl p-8 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 20%, white 0%, transparent 60%)' }} />
                  <div className="relative">
                    <div className="flex items-end space-x-3 mb-4">
                      <span className="text-8xl font-black text-slate-900 leading-none">{placesLeft}</span>
                      <div className="pb-3">
                        <div className="text-slate-900/80 font-black text-xl">place{placesLeft > 1 ? 's' : ''}</div>
                        <div className="text-slate-900/50 text-sm">disponible{placesLeft > 1 ? 's' : ''} sur {PLACES_TOTAL}</div>
                      </div>
                    </div>
                    <div className="w-full bg-slate-900/15 rounded-full h-2.5 mb-4">
                      <div className="bg-slate-900/40 h-2.5 rounded-full transition-all" style={{ width: `${((PLACES_TOTAL - placesLeft) / PLACES_TOTAL) * 100}%` }} />
                    </div>
                    <p className="text-slate-900/60 text-xs leading-relaxed">
                      Chaque place est attribuée manuellement après un appel de qualification. Une fois les 20 établissements sélectionnés, ce programme ferme <strong className="text-slate-900/80">définitivement et irrévocablement.</strong>
                    </p>
                  </div>
                </div>

                {/* Fondateurs list */}
                <div className="bg-slate-900 border border-white/6 rounded-2xl p-5 space-y-3">
                  <div className="text-xs font-bold text-white/20 uppercase tracking-wider">Déjà Fondateurs</div>
                  {foundersList.map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-3.5 bg-white/3 border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-amber-400/20 to-orange-500/10 border border-amber-400/20 rounded-xl flex items-center justify-center text-amber-400 font-black text-xs shrink-0">
                          {p.school.charAt(0)}
                        </div>
                        <div>
                          <div className="text-white/80 font-semibold text-sm">{p.school}</div>
                          <div className="text-white/25 text-xs">{p.name} · {p.country}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-emerald-400 bg-emerald-400/8 border border-emerald-400/15 px-2 py-1 rounded-full font-bold shrink-0">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Fondateur</span>
                      </div>
                    </div>
                  ))}
                  {/* Empty slots */}
                  {Array.from({ length: Math.min(3, placesLeft) }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-3 p-3.5 border border-dashed border-white/8 rounded-xl opacity-40">
                      <div className="w-9 h-9 border border-dashed border-white/15 rounded-xl shrink-0" />
                      <div className="text-white/20 text-sm">Place disponible...</div>
                    </div>
                  ))}
                </div>

                {/* Comparison table */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-amber-400/6 border border-amber-400/15 rounded-2xl p-4">
                    <div className="flex items-center space-x-1.5 mb-3">
                      <Star className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-amber-400 font-black text-xs uppercase tracking-wider">Fondateur</span>
                    </div>
                    {[
                      { l: 'An 1 gratuit', v: '✓' },
                      { l: 'Tarif annuel', v: '60 000 FCFA' },
                      { l: 'Tarif garanti', v: '✓' },
                      { l: 'Formation équipes', v: 'Incluse' },
                      { l: 'Co-création', v: '✓' },
                    ].map((r, i) => (
                      <div key={i} className="flex justify-between py-1.5 border-b border-amber-400/8 last:border-0 text-xs">
                        <span className="text-white/40">{r.l}</span>
                        <span className="text-amber-400 font-bold">{r.v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white/2 border border-white/6 rounded-2xl p-4">
                    <div className="flex items-center space-x-1.5 mb-3">
                      <Users className="w-3.5 h-3.5 text-white/20" />
                      <span className="text-white/20 font-black text-xs uppercase tracking-wider">Tarif public</span>
                    </div>
                    {[
                      { l: 'An 1 gratuit', v: '✗' },
                      { l: 'Tarif annuel', v: '120 000 FCFA' },
                      { l: 'Tarif garanti', v: '✗' },
                      { l: 'Formation équipes', v: '✗' },
                      { l: 'Co-création', v: '✗' },
                    ].map((r, i) => (
                      <div key={i} className="flex justify-between py-1.5 border-b border-white/5 last:border-0 text-xs">
                        <span className="text-white/25">{r.l}</span>
                        <span className="text-white/20">{r.v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="flex items-start space-x-2 text-[11px] text-white/30 leading-relaxed mt-3">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-emerald-400/80">Migration des données offerte à tous les établissements</strong>
                    {' '}— programme Fondateur comme tarif public.
                  </span>
                </p>

                <button onClick={() => scrollTo('candidature')}
                  className="w-full flex items-center justify-center space-x-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black py-4 rounded-2xl transition-all text-sm glow-amber hover:glow-amber-strong hover:scale-[1.01]">
                  <Rocket className="w-4 h-4" />
                  <span>Sécuriser ma place maintenant</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ══ FAQ ═════════════════════════════════════════════════════════════ */}
      <RevealSection>
        <section className="py-14 md:py-20 border-t border-white/5">
          <div className="max-w-3xl mx-auto px-4 md:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-black text-white">Questions fréquentes</h2>
              <p className="text-white/30 text-sm mt-2">Tout ce que vous devez savoir avant de candidater.</p>
            </div>
            <div className="bg-slate-900 border border-white/6 rounded-2xl px-6 py-2">
              {[
                { q: "C'est vraiment gratuit la première année ?", r: "Oui — accès complet à toute la plateforme et formation de vos équipes. 0 FCFA en an 1 pour les 20 Fondateurs 2026. C'est notre investissement dans votre succès et dans la co-construction du produit." },
                { q: "Et si ça ne nous convient pas après an 1 ?", r: "Aucun engagement de durée. Vous continuez parce que ça génère de la valeur, pas parce que vous êtes bloqué. Vos données sont exportables à tout instant dans vos propres fichiers — elles vous appartiennent." },
                { q: "Nos enseignants vont-ils vraiment l'adopter ?", r: "L'interface a été conçue pour des non-techniciens : appel en 3 taps, note en 10 secondes, messagerie intégrée. La formation incluse dure 2h. Opérationnels le jour même, même pour les moins à l'aise avec le numérique." },
                { q: "Qui est SmartLimb ?", r: "Startup technologique nigérienne fondée à Niamey. SchoolOS est notre produit phare, conçu sur le terrain pour répondre aux réalités concrètes des établissements privés d'Afrique francophone." },
                { q: "Combien ça coûte à partir de la 2e année ?", r: "Tarif Fondateur : 60 000 FCFA/an — garanti pendant votre abonnement. Tarif public : 120 000 FCFA/an, tout inclus, jusqu'à 500 élèves. Aucun module à acheter séparément, aucun frais caché." },
                { q: "Nous avons déjà un logiciel. Peut-on migrer ?", r: "Oui. Notre équipe prend en charge l'import de tous vos fichiers Excel, bases de données, et documents papier scannés. La migration est offerte à toutes les écoles — Fondateurs comme clients du tarif public — et se fait sans interruption de service." },
              ].map((faq, i) => (
                <div key={i}><FaqItem q={faq.q} r={faq.r} /></div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ══ POURQUOI SCHOOLOS ══════════════════════════════════════════════ */}
      <RevealSection>
        <section id="pourquoi" className="py-16 md:py-28 border-t border-white/5 relative overflow-hidden scroll-mt-20 md:scroll-mt-24">
          {/* Fond ambiant */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-emerald-500/3 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">
            {/* En-tête */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 bg-white/4 border border-white/10 text-white/50 text-[11px] font-bold uppercase tracking-[0.2em] rounded-full px-4 py-2 mb-6">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Développé au Niger</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                Pourquoi <span className="text-gradient-amber">SchoolOS</span> ?
              </h2>
              <p className="text-white/60 font-bold text-base md:text-lg mt-4">
                Développé par SmartLimb au Niger
              </p>
            </div>

            {/* Discours + piliers */}
            <div className="bg-slate-900/70 border border-white/8 rounded-[1.75rem] p-7 md:p-10 card-3d">
              <p className="text-white/50 text-sm md:text-base leading-relaxed">
                Nous construisons des solutions numériques adaptées aux réalités des organisations africaines,
                avec une priorité donnée à <strong className="text-white/85 font-bold">la simplicité</strong>, à{' '}
                <strong className="text-white/85 font-bold">la sécurité des données</strong> et à{' '}
                <strong className="text-white/85 font-bold">l'adoption par les équipes</strong>.
              </p>
              <p className="text-white/30 text-sm leading-relaxed mt-4">
                Confier les dossiers de centaines d'élèves à une plateforme demande une confiance réelle.
                C'est pourquoi SchoolOS est développé et maintenu à Niamey : une équipe joignable localement,
                des sauvegardes régulières, et vos données exportables à tout moment — elles restent les vôtres.
              </p>

              {/* 3 piliers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                {[
                  { Icon: Zap, title: 'Simplicité', desc: 'Utilisable sans compétence technique, même sur un téléphone modeste.' },
                  { Icon: Shield, title: 'Sécurité des données', desc: 'Sauvegardes régulières et données exportables à tout instant.' },
                  { Icon: Users, title: 'Adoption par les équipes', desc: 'Conçu sur le terrain, avec des enseignants et des secrétaires.' },
                ].map((p, i) => (
                  <div key={i} className="bg-white/2 border border-white/6 rounded-2xl p-5">
                    <div className="inline-flex p-2.5 rounded-xl bg-amber-400/8 border border-amber-400/12 mb-3">
                      <p.Icon className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="text-white/80 font-bold text-sm">{p.title}</div>
                    <div className="text-white/30 text-xs mt-2 leading-relaxed">{p.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chips de réassurance */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              {[
                { Icon: School, label: 'Produit développé à Niamey' },
                { Icon: MessageCircle, label: 'Support local' },
                { Icon: Cpu, label: 'Équipe technique locale' },
              ].map((c, i) => (
                <div key={i} className="flex items-center space-x-2 bg-white/4 border border-white/8 rounded-full px-4 py-2.5 text-xs font-semibold text-white/50">
                  <c.Icon className="w-3.5 h-3.5 text-amber-400" />
                  <span>{c.label}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center mt-10">
              <button onClick={() => scrollTo('candidature')}
                className="inline-flex items-center space-x-2 text-amber-400 hover:text-amber-300 text-sm font-bold transition-colors">
                <span>Rejoindre le Programme Fondateur 2026</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ══ FORMULAIRE ══════════════════════════════════════════════════════ */}
      <RevealSection>
        <section id="candidature" className="py-16 md:py-28 border-t border-white/5 relative overflow-hidden scroll-mt-20 md:scroll-mt-24">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-400/2 to-transparent pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-400/4 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-xl mx-auto px-4 md:px-8 relative z-10">
            {!submitted ? (
              <>
                <div className="text-center mb-8">
                  <div className="w-14 h-14 bg-amber-400/10 border border-amber-400/20 rounded-2xl flex items-center justify-center mx-auto mb-5 glow-amber">
                    <Rocket className="w-7 h-7 text-amber-400" />
                  </div>
                  <span className="text-xs font-bold text-amber-400/50 uppercase tracking-[0.15em]">Candidature Fondateurs</span>
                  <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 mb-3 tracking-tight leading-tight">
                    Inaugurez l'ère<br />numérique de votre école.
                  </h2>
                  <p className="text-white/35 text-sm">60 secondes. Aucun engagement. Réponse WhatsApp sous 48h.</p>
                </div>

                {/* Urgency banner */}
                <div className="flex items-center justify-between p-4 bg-amber-400/6 border border-amber-400/12 rounded-2xl mb-6 animate-shimmer">
                  <div className="flex items-center space-x-2.5 text-sm text-amber-400/80">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="font-black text-amber-400">{placesLeft} place{placesLeft > 1 ? 's' : ''} disponible{placesLeft > 1 ? 's' : ''}</span>
                      <span className="text-white/40"> · 12 mois gratuits · Formation offerte · Migration offerte à tous</span>
                    </div>
                  </div>
                  <div className="w-20 bg-white/8 rounded-full h-1.5 shrink-0 ml-4">
                    <div className="bg-amber-400 h-1.5 rounded-full transition-all" style={{ width: `${((PLACES_TOTAL - placesLeft) / PLACES_TOTAL) * 100}%` }} />
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-white/30 mb-2 uppercase tracking-wider">Votre nom complet *</label>
                      <input required value={name} onChange={e => setName(e.target.value)} placeholder="M. Ibrahim Issoufou" className={inp} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-white/30 mb-2 uppercase tracking-wider">Nom de l'établissement *</label>
                      <input required value={school} onChange={e => setSchool(e.target.value)} placeholder="Lycée Privé Malam Issa" className={inp} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-white/30 mb-2 uppercase tracking-wider">WhatsApp *</label>
                      <input required value={whatsapp} onChange={e => setWhatsapp(formatNigerInput(e.target.value))} inputMode="numeric" placeholder="+227 87 72 75 01" className={inp} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-white/30 mb-2 uppercase tracking-wider">Email professionnel</label>
                      <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="direction@ecole.ne" className={inp} />
                    </div>

                    {/* Nombre approximatif d'élèves — qualification du prospect */}
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-white/30 mb-2 uppercase tracking-wider">Nombre approximatif d'élèves *</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {STUDENT_RANGES.map((range, i) => (
                          <label key={range}
                            className={`flex items-center justify-center text-center px-3 py-3 rounded-xl border text-xs font-bold cursor-pointer transition-all focus-within:ring-2 focus-within:ring-amber-400/25 ${
                              students === range
                                ? 'bg-amber-400/12 border-amber-400/40 text-amber-400'
                                : 'bg-white/4 border-white/8 text-white/40 hover:border-white/20 hover:text-white/70'
                            }`}>
                            <input type="radio" name="students_range" required={i === 0} value={range}
                              checked={students === range} onChange={() => setStudents(range)} className="sr-only" />
                            <span>{range}</span>
                            {students === range && <Check className="w-3 h-3 ml-1.5 shrink-0" />}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Erreur d'enregistrement (réseau / feuille injoignable) */}
                  {sendError && (
                    <div className="flex items-start space-x-2.5 p-3.5 bg-rose-500/8 border border-rose-500/25 rounded-2xl text-rose-300 text-xs leading-relaxed">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{sendError}</span>
                    </div>
                  )}

                  <button type="submit" disabled={sending}
                    className="w-full py-4 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 disabled:cursor-wait text-slate-900 font-black rounded-2xl transition-all text-sm flex items-center justify-center space-x-2 glow-amber hover:glow-amber-strong hover:scale-[1.01]">
                    {sending ? (
                      <>
                        <span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                        <span>Enregistrement en cours…</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Sécuriser ma place Fondateur — Gratuit</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Repère de configuration : visible uniquement tant que l'URL Apps Script est absente */}
                  {!SHEET_ENABLED && (
                    <p className="text-center text-[10px] font-mono text-amber-400/45 leading-relaxed">
                      mode démo — VITE_APPS_SCRIPT_URL non configurée : aucune donnée n'est envoyée
                    </p>
                  )}

                  <div className="flex items-center justify-center space-x-4 text-[10px] text-white/20 pt-1">
                    <div className="flex items-center space-x-1"><Shield className="w-3 h-3" /><span>Données confidentielles</span></div>
                    <span>·</span>
                    <div className="flex items-center space-x-1"><MessageCircle className="w-3 h-3" /><span>Réponse WhatsApp sous 48h</span></div>
                    <span>·</span>
                    <div className="flex items-center space-x-1"><Lock className="w-3 h-3" /><span>Aucun engagement financier</span></div>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center space-y-6 py-8">
                <div className="w-20 h-20 bg-emerald-400/10 border-2 border-emerald-400/20 rounded-3xl flex items-center justify-center mx-auto relative">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  <div className="absolute inset-0 rounded-3xl animate-ping-slow border-2 border-emerald-400/20" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white mb-2">Candidature enregistrée !</h3>
                  <p className="text-white/40">Bienvenue dans le Programme Fondateurs SchoolOS, <strong className="text-white">{name}</strong>.</p>
                </div>
                <div className="bg-slate-900 border border-white/6 rounded-2xl p-6 text-left max-w-sm mx-auto space-y-2">
                  <div className="text-xs font-mono text-white/20 uppercase tracking-wider text-center mb-4">Confirmation #FNDR-{founderRef}</div>
                  {[
                    { label: 'Établissement', val: school },
                    { label: 'Élèves (approx.)', val: students },
                    { label: 'Responsable', val: name },
                    { label: 'WhatsApp', val: whatsapp },
                    { label: 'Statut', val: `Fondateur #FNDR-${founderRef}`, highlight: true },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                      <span className="text-white/25 text-sm">{row.label}</span>
                      <span className={row.highlight ? 'text-amber-400 font-black text-sm' : 'text-white/60 text-sm font-medium'}>{row.val}</span>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-amber-400/6 border border-amber-400/12 rounded-2xl text-sm text-amber-400/80 max-w-sm mx-auto">
                  <strong className="text-amber-400">Prochaine étape :</strong> Notre équipe vous contacte sur WhatsApp sous <strong className="text-amber-400">48h</strong> pour planifier votre appel de qualification.
                </div>
                <button onClick={onDeck} className="text-sm text-white/30 hover:text-white/60 transition-colors flex items-center space-x-1.5 mx-auto">
                  <Eye className="w-4 h-4" />
                  <span>Découvrir la présentation complète</span>
                </button>
              </div>
            )}
          </div>
        </section>
      </RevealSection>

      {/* ══ FOOTER ══════════════════════════════════════════════════════════ */}
      <footer className="border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-amber-400 rounded-xl flex items-center justify-center glow-amber">
                <School className="w-5 h-5 text-slate-900" />
              </div>
              <div>
                <div className="font-black text-white">School<span className="text-amber-400">OS</span></div>
                <div className="text-white/20 text-xs">by SmartLimb · Niamey, Niger · 2026</div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-5 text-sm text-white/25">
              {[['solution','Produit'],['tarifs','Tarifs'],['pourquoi','Pourquoi SchoolOS'],['fondateurs','Programme'],['candidature','Candidater']].map(([id,label]) => (
                <button key={id} onClick={() => scrollTo(id)} className="hover:text-white/60 transition-colors">{label}</button>
              ))}
              <button onClick={onDeck} className="hover:text-white/60 transition-colors">Présentation</button>
            </div>
            <div className="flex items-center space-x-2 text-white/15 text-xs">
              <Globe className="w-3.5 h-3.5" />
              <span>schoolos.africa</span>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-white/10">
            © 2026 SmartLimb. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
