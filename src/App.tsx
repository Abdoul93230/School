import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight, ChevronLeft, ArrowRight, Database, CreditCard,
  Users, Clock, TrendingUp, TrendingDown, BookOpen, Smartphone,
  CheckCircle2, AlertTriangle, Award, Sparkles, Activity, School,
  Cpu, Check, Star, Globe, Shield, Play, Pause, Zap, Target,
  BarChart3, MessageSquare, Bell, FileText, Settings, Home,
  ChevronDown, Search, Filter, MoreVertical, Eye, Download,
  Wifi, Battery, Signal, Archive, Upload, Camera, GraduationCap,
  Calendar, PenLine, FolderOpen, Image, MapPin, BookMarked
} from 'lucide-react';
import { SLIDES_DATA } from './slidesData';
import { sendCandidature, fetchCandidatureCount, SHEET_ENABLED } from './candidature';
import { formatNigerInput, isCompleteNigerNumber, NIGER_PREFIX } from './whatsapp';

const PLACES_TOTAL = 20;

/** Tranches d'effectif proposées à la candidature (qualification du prospect) */
const STUDENT_RANGES = ['Moins de 200', '200–500', '500–1 000', 'Plus de 1 000'];

// ─── Mockup components ──────────────────────────────────────────────────

function DashboardMockup() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['Aperçu', 'Finances', 'Élèves'];

  return (
    <div className="w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-xl">
      {/* Browser bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center space-x-3">
        <div className="flex space-x-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-amber-400"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
        </div>
        <div className="flex-1 bg-slate-100 rounded-lg px-3 py-1 text-xs text-slate-400 font-mono flex items-center space-x-2">
          <Shield className="w-3 h-3 text-emerald-500" />
          <span>app.schoolos.africa/dashboard</span>
        </div>
      </div>

      <div className="flex" style={{ minHeight: 320 }}>
        {/* Sidebar */}
        <div className="w-14 bg-slate-900 flex flex-col items-center py-4 space-y-4">
          <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
            <School className="w-4 h-4 text-slate-900" />
          </div>
          {[Home, BarChart3, Users, CreditCard, FileText, Settings].map((Icon, i) => (
            <button key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${i === 0 ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}>
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-slate-400">Lycée Privé Malam Issa — Niamey</p>
              <h2 className="text-sm font-bold text-slate-900">Bonjour, M. Ibrahim 👋</h2>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Bell className="w-4 h-4 text-slate-400" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
              </div>
              <div className="w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center text-xs font-bold text-slate-900">MI</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-4 bg-slate-100 rounded-lg p-1">
            {tabs.map((t, i) => (
              <button key={i} onClick={() => setActiveTab(i)}
                className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-all ${activeTab === i ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
                {t}
              </button>
            ))}
          </div>

          {activeTab === 0 && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Recouvrement', val: '94%', sub: '+18% ce mois', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
                  { label: 'Élèves actifs', val: '487', sub: '3 nouvelles inscriptions', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
                  { label: 'Impayés', val: '12', sub: 'familles en retard', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' },
                ].map((s, i) => (
                  <div key={i} className={`p-2.5 rounded-xl border ${s.bg}`}>
                    <div className={`text-lg font-bold ${s.color}`}>{s.val}</div>
                    <div className="text-xs text-slate-500 leading-tight">{s.label}</div>
                    <div className={`text-xs mt-0.5 ${s.color} opacity-70`}>{s.sub}</div>
                  </div>
                ))}
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-slate-700">Taux de recouvrement — Juin 2026</span>
                  <span className="text-xs text-emerald-600 font-medium">94%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>460 familles réglées</span>
                  <span>27 restantes</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-600 mb-1">Alertes récentes</div>
                {[
                  { text: 'Moussa Abdou — 3e absence consécutive (3è A)', type: 'warn' },
                  { text: 'Famille Seyni — Echéance trimestre 2 dépassée', type: 'error' },
                  { text: '47 bulletins générés — Trimestre 2 prêts', type: 'ok' },
                ].map((a, i) => (
                  <div key={i} className={`flex items-center space-x-2 text-xs p-2 rounded-lg ${a.type === 'ok' ? 'bg-emerald-50 text-emerald-700' : a.type === 'warn' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}>
                    {a.type === 'ok' ? <Check className="w-3 h-3 shrink-0" /> : <AlertTriangle className="w-3 h-3 shrink-0" />}
                    <span>{a.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Encaissé ce mois', val: '4 620 000', unit: 'FCFA', color: 'text-emerald-600' },
                  { label: 'En attente', val: '840 000', unit: 'FCFA', color: 'text-rose-600' },
                ].map((s, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <div className="text-xs text-slate-500 mb-1">{s.label}</div>
                    <div className={`text-xl font-bold font-mono ${s.color}`}>{s.val}</div>
                    <div className="text-xs text-slate-400">{s.unit}</div>
                  </div>
                ))}
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <div className="text-xs font-semibold text-slate-700 mb-2">Derniers paiements</div>
                {[
                  { name: 'Famille Mahamane', amount: '85 000', date: 'Aujourd\'hui' },
                  { name: 'Famille Alou', amount: '120 000', date: 'Hier' },
                  { name: 'Famille Zeinabou', amount: '85 000', date: '18 Juin' },
                ].map((p, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                    <div className="text-xs text-slate-700">{p.name}</div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-emerald-600 font-mono font-medium">+{p.amount} FCFA</span>
                      <span className="text-xs text-slate-400">{p.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex-1 bg-slate-100 rounded-lg px-3 py-1.5 flex items-center space-x-2">
                  <Search className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-400">Rechercher un élève...</span>
                </div>
                <button className="p-1.5 bg-slate-100 rounded-lg"><Filter className="w-3 h-3 text-slate-500" /></button>
              </div>
              {[
                { name: 'Aïchatou Moussa', class: '3è A', avg: '14.8', status: 'ok' },
                { name: 'Moussa Abdou', class: '3è A', avg: '8.2', status: 'warn' },
                { name: 'Fatouma Seyni', class: 'Tle D', avg: '16.1', status: 'ok' },
                { name: 'Issoufou Hamidou', class: '2nde B', avg: '11.4', status: 'ok' },
              ].map((e, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="flex items-center space-x-2.5">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${e.status === 'warn' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>
                      {e.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-800">{e.name}</div>
                      <div className="text-xs text-slate-400">{e.class}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-bold font-mono ${parseFloat(e.avg) >= 10 ? 'text-emerald-600' : 'text-rose-600'}`}>{e.avg}</span>
                    {e.status === 'warn' && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BulletinMockup() {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Header bulletin */}
      <div className="bg-slate-900 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <School className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-white">Lycée Privé Malam Issa — Niamey</span>
        </div>
        <span className="text-xs text-slate-400 font-mono">Trimestre 2 · 2025–2026</span>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Fatouma Seyni</h3>
            <p className="text-xs text-slate-500">Classe : Terminale D · N° : 042</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-600">16.1<span className="text-sm text-slate-400">/20</span></div>
            <div className="text-xs text-slate-500">Moyenne générale</div>
          </div>
        </div>
        <div className="space-y-1.5 mb-4">
          {[
            { matiere: 'Mathématiques', note: 17.5, coeff: 5 },
            { matiere: 'Sciences Physiques', note: 15, coeff: 4 },
            { matiere: 'SVT', note: 16, coeff: 3 },
            { matiere: 'Français', note: 14, coeff: 3 },
            { matiere: 'Anglais', note: 16.5, coeff: 2 },
          ].map((m, i) => (
            <div key={i} className="flex items-center gap-2 text-xs p-2 bg-slate-50 rounded-lg">
              <span className="text-slate-700 flex-1 min-w-0 truncate">{m.matiere}</span>
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-16 sm:w-24 bg-slate-200 rounded-full h-1.5">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${(m.note / 20) * 100}%` }}></div>
                </div>
                <span className={`font-bold font-mono text-right ${m.note >= 10 ? 'text-emerald-600' : 'text-rose-600'}`}>{m.note}</span>
                <span className="text-slate-400 hidden sm:inline">coeff {m.coeff}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-slate-600 italic">
          <span className="font-semibold not-italic text-amber-700">Appréciation : </span>
          Élève sérieuse et régulière. Ses résultats en mathématiques et en sciences sont excellents. Continue ainsi pour le baccalauréat.
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-slate-400">Généré automatiquement par SchoolOS · {new Date().toLocaleDateString('fr-FR')}</span>
          <button className="flex items-center space-x-1.5 text-xs bg-slate-900 text-white px-3 py-1.5 rounded-lg">
            <Download className="w-3 h-3" />
            <span>Télécharger PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function PhoneMockup({ notif }: { notif: string }) {
  return (
    <div className="mx-auto w-60" style={{ perspective: '1000px' }}>
      <div className="bg-slate-800 rounded-[2.5rem] p-2 shadow-2xl">
        <div className="bg-white rounded-[2rem] overflow-hidden">
          {/* Status bar */}
          <div className="bg-slate-900 px-5 pt-3 pb-1.5 flex items-center justify-between">
            <span className="text-white text-xs font-mono">09:41</span>
            <div className="w-16 h-4 bg-slate-700 rounded-full"></div>
            <div className="flex items-center space-x-1">
              <Signal className="w-3 h-3 text-white" />
              <Wifi className="w-3 h-3 text-white" />
              <Battery className="w-3 h-3 text-white" />
            </div>
          </div>
          <div className="bg-gradient-to-b from-slate-900 to-slate-800 px-4 pb-4 pt-2 min-h-[220px]">
            <div className="text-center text-slate-400 text-xs mb-4">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</div>

            {/* Notification card */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-3.5 border border-white/20">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-amber-400 rounded-lg flex items-center justify-center">
                  <School className="w-3.5 h-3.5 text-slate-900" />
                </div>
                <div>
                  <div className="text-white text-xs font-semibold">SchoolOS</div>
                  <div className="text-slate-400 text-xs">il y a 2 min</div>
                </div>
              </div>
              {notif === 'fees' && <>
                <div className="text-white text-sm font-semibold mb-1">✅ Paiement confirmé</div>
                <div className="text-slate-300 text-xs leading-relaxed">Règlement reçu : 85 000 FCFA pour Aïchatou Moussa — Trimestre 2. Reçu disponible.</div>
              </>}
              {notif === 'absent' && <>
                <div className="text-rose-300 text-sm font-semibold mb-1">⚠️ Absence signalée</div>
                <div className="text-slate-300 text-xs leading-relaxed">Moussa Abdou n'a pas répondu à l'appel du matin (8h30 — Mathématiques). Contactez la vie scolaire si justifiée.</div>
              </>}
              {notif === 'homework' && <>
                <div className="text-blue-300 text-sm font-semibold mb-1">📚 Devoir — Physique</div>
                <div className="text-slate-300 text-xs leading-relaxed">Exercices page 47 à rendre lundi. Contrôle sur les ondes prévu jeudi prochain.</div>
              </>}
              {notif === 'praise' && <>
                <div className="text-amber-300 text-sm font-semibold mb-1">🌟 Félicitations !</div>
                <div className="text-slate-300 text-xs leading-relaxed">Fatouma est 1ère de sa classe ce trimestre avec 16.1/20. La direction la félicite chaleureusement.</div>
              </>}
            </div>
            <p className="text-center text-slate-500 text-xs mt-3">Aucune application à installer • SMS & WhatsApp</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AIAlertMockup() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-lg">
      <div className="bg-slate-900 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-white">SchoolOS AI — Alertes prédictives</span>
        </div>
        <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">En direct</span>
      </div>
      <div className="p-4 space-y-3">
        {[
          {
            name: 'Moussa Abdou', class: '3è A',
            risk: 86, type: 'Risque décrochage',
            detail: '3 absences mardi matin + baisse de 6 pts en maths en 30j',
            action: 'Entretien conseiller recommandé cette semaine',
            color: 'border-rose-200 bg-rose-50'
          },
          {
            name: 'Halima Inoussa', class: '2nde C',
            risk: 62, type: 'Attention requise',
            detail: 'Devoirs non rendus × 4 semaines consécutives',
            action: 'Notification SMS parent envoyée automatiquement',
            color: 'border-amber-200 bg-amber-50'
          },
          {
            name: 'Souleymane Badié', class: 'Tle D',
            risk: 41, type: 'À surveiller',
            detail: 'Légère baisse en Français — historique positif',
            action: 'Mise en observation — pas d\'action immédiate',
            color: 'border-blue-200 bg-blue-50'
          },
        ].map((alert, i) => (
          <div key={i} className={`p-3 rounded-xl border ${alert.color}`}>
            <div className="flex items-start justify-between mb-1.5">
              <div>
                <span className="text-sm font-semibold text-slate-900">{alert.name}</span>
                <span className="text-xs text-slate-500 ml-2">{alert.class}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  alert.risk >= 75 ? 'bg-rose-100 text-rose-700' :
                  alert.risk >= 50 ? 'bg-amber-100 text-amber-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {alert.risk}% risque
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-600 mb-1.5">{alert.detail}</p>
            <div className="flex items-center space-x-1.5 text-xs text-slate-500">
              <Zap className="w-3 h-3 text-amber-500" />
              <span className="italic">{alert.action}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OnboardingMockup() {
  const [step, setStep] = useState(0);
  const steps = ['Infos élève', 'Documents', 'Dossier archivé'];

  return (
    <div className="w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-xl">
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center space-x-3">
        <div className="flex space-x-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-amber-400"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
        </div>
        <div className="flex-1 bg-slate-100 rounded-lg px-3 py-1 text-xs text-slate-400 font-mono flex items-center space-x-2">
          <Shield className="w-3 h-3 text-emerald-500" />
          <span>app.schoolos.africa/onboarding</span>
        </div>
      </div>

      <div className="bg-white p-5">
        {/* Stepper */}
        <div className="flex items-center mb-5">
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <button onClick={() => setStep(i)} className="flex items-center space-x-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i <= step ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${i <= step ? 'text-slate-900' : 'text-slate-400'}`}>{s}</span>
              </button>
              {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-slate-900' : 'bg-slate-200'}`}></div>}
            </React.Fragment>
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Prénom', val: 'Aïchatou' },
                { label: 'Nom', val: 'Moussa' },
                { label: 'Date de naissance', val: '14/03/2009' },
                { label: 'Lieu de naissance', val: 'Niamey' },
                { label: 'Classe souhaitée', val: '3ème A' },
                { label: 'Téléphone parent', val: '+227 96 xx xx xx' },
              ].map((f, i) => (
                <div key={i}>
                  <label className="text-xs text-slate-400 mb-1 block">{f.label}</label>
                  <div className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 bg-slate-50">{f.val}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setStep(1)} className="w-full py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl flex items-center justify-center space-x-2">
              <span>Continuer — Scan des documents</span><ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 mb-2">Téléversez ou scannez les documents requis pour l'inscription :</p>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: 'Acte de naissance', icon: FileText, status: 'done' },
                { label: 'Bulletin T3 (année préc.)', icon: BookMarked, status: 'done' },
                { label: 'Photo d\'identité', icon: Camera, status: 'done' },
                { label: 'Certificat de scolarité', icon: GraduationCap, status: 'pending' },
              ].map((doc, i) => (
                <div key={i} className={`p-3 rounded-xl border flex flex-col items-center space-y-2 cursor-pointer transition-all ${doc.status === 'done' ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-dashed border-slate-300 hover:border-amber-300'}`}>
                  <doc.icon className={`w-5 h-5 ${doc.status === 'done' ? 'text-emerald-500' : 'text-slate-300'}`} />
                  <span className="text-xs text-center leading-tight text-slate-600">{doc.label}</span>
                  {doc.status === 'done'
                    ? <span className="text-xs text-emerald-600 font-semibold">✓ Scanné</span>
                    : <span className="text-xs text-slate-400 flex items-center space-x-1"><Upload className="w-3 h-3" /><span>Ajouter</span></span>
                  }
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <button onClick={() => setStep(0)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl">Retour</button>
              <button onClick={() => setStep(2)} className="flex-2 flex-1 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl flex items-center justify-center space-x-2">
                <span>Valider l'inscription</span><Check className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-3 mb-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
              <div>
                <div className="text-sm font-semibold text-emerald-800">Dossier créé — Aïchatou Moussa</div>
                <div className="text-xs text-emerald-600">N° élève : SCH-2026-0488 · 3ème A</div>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Archive className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-700">Archive numérique permanente</span>
              </div>
              <div className="space-y-1.5">
                {[
                  { name: 'Acte de naissance', date: 'Scanné aujourd\'hui', icon: FileText },
                  { name: 'Bulletin T3 2024-2025', date: 'Importé', icon: BookMarked },
                  { name: 'Photo identité', date: 'Scanné aujourd\'hui', icon: Camera },
                ].map((doc, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-2 bg-white border border-slate-100 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <doc.icon className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-700">{doc.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400">{doc.date}</span>
                      <button className="text-blue-500 hover:underline">Voir</button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-3 italic">Documents accessibles pour toujours — même après la sortie de l'élève.</p>
            </div>
            <button onClick={() => setStep(0)} className="text-xs text-slate-400 underline w-full text-center">Inscrire un autre élève</button>
          </div>
        )}
      </div>
    </div>
  );
}

function ParentPortalMockup() {
  const [tab, setTab] = useState(0);
  const tabs = ['Tableau de bord', 'Notes', 'Paiements', 'Messages'];

  return (
    <div className="w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-xl">
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center space-x-3">
        <div className="flex space-x-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-amber-400"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
        </div>
        <div className="flex-1 bg-slate-100 rounded-lg px-3 py-1 text-xs text-slate-400 font-mono flex items-center space-x-2">
          <Shield className="w-3 h-3 text-emerald-500" />
          <span>app.schoolos.africa/parent</span>
        </div>
      </div>

      <div className="bg-white p-5">
        {/* Parent header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-700">FM</div>
            <div>
              <div className="text-sm font-semibold text-slate-800">Famille Moussa</div>
              <div className="text-xs text-slate-400">Aïchatou · 3ème A · Lycée Malam Issa</div>
            </div>
          </div>
          <div className="relative">
            <Bell className="w-4 h-4 text-slate-400" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-slate-100 rounded-lg p-1 mb-4">
          {tabs.map((t, i) => (
            <button key={i} onClick={() => setTab(i)}
              className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-all ${tab === i ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === 0 && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Moyenne', val: '14.8', sub: '+0.6 ce trim.', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
                { label: 'Absences', val: '2', sub: 'ce trimestre', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
                { label: 'Rang', val: '3e', sub: 'sur 42 élèves', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
              ].map((s, i) => (
                <div key={i} className={`p-2.5 rounded-xl border ${s.bg}`}>
                  <div className={`text-lg font-bold ${s.color}`}>{s.val}</div>
                  <div className="text-xs text-slate-500">{s.label}</div>
                  <div className={`text-xs ${s.color} opacity-70`}>{s.sub}</div>
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-slate-600">Dernières alertes</div>
              {[
                { text: 'Absence Jeudi 12 juin — cours du matin', type: 'warn', time: 'Jeudi 09:05' },
                { text: 'Félicitations — 1ère en Sciences Physiques', type: 'ok', time: 'Mardi' },
                { text: 'Rappel paiement — Trimestre 3 dû le 30 juin', type: 'info', time: 'Lundi' },
              ].map((a, i) => (
                <div key={i} className={`flex items-center justify-between text-xs p-2.5 rounded-lg ${a.type === 'ok' ? 'bg-emerald-50 text-emerald-700' : a.type === 'warn' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                  <span>{a.text}</span>
                  <span className="text-slate-400 ml-2 shrink-0">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 1 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700">Trimestre 2 — 2025/2026</span>
              <button className="flex items-center space-x-1.5 text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                <Download className="w-3 h-3" /><span>Bulletin PDF</span>
              </button>
            </div>
            {[
              { mat: 'Mathématiques', note: 16, coeff: 5 },
              { mat: 'Français', note: 13, coeff: 3 },
              { mat: 'Sciences Physiques', note: 17, coeff: 4 },
              { mat: 'Histoire-Géo', note: 14, coeff: 2 },
              { mat: 'Anglais', note: 15, coeff: 2 },
            ].map((m, i) => (
              <div key={i} className="flex items-center text-xs p-2.5 bg-slate-50 rounded-xl">
                <span className="flex-1 text-slate-700">{m.mat}</span>
                <div className="w-20 bg-slate-200 rounded-full h-1.5 mr-3">
                  <div className={`h-1.5 rounded-full ${m.note >= 14 ? 'bg-emerald-400' : m.note >= 10 ? 'bg-amber-400' : 'bg-rose-400'}`} style={{ width: `${(m.note / 20) * 100}%` }}></div>
                </div>
                <span className={`font-bold font-mono w-8 text-right ${m.note >= 10 ? 'text-emerald-600' : 'text-rose-600'}`}>{m.note}/20</span>
              </div>
            ))}
          </div>
        )}

        {tab === 2 && (
          <div className="space-y-3">
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-semibold text-emerald-800">Situation compte — An scolaire 2025/26</span>
                <span className="text-xs font-bold text-emerald-700">À jour ✓</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Frais annuels</span><span className="font-mono text-slate-800">255 000 FCFA</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Versé</span><span className="font-mono text-emerald-700">255 000 FCFA</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Restant</span><span className="font-mono text-slate-800">0 FCFA</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-slate-600">Historique des paiements</div>
              {[
                { desc: 'Tranche 3 — Trimestre 3', amount: '85 000', date: '02/06/2026', receipt: true },
                { desc: 'Tranche 2 — Trimestre 2', amount: '85 000', date: '08/03/2026', receipt: true },
                { desc: 'Tranche 1 — Inscription + T1', amount: '85 000', date: '14/10/2025', receipt: true },
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between text-xs p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                  <div>
                    <div className="text-slate-800 font-medium">{p.desc}</div>
                    <div className="text-slate-400">{p.date}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-emerald-600 font-bold">{p.amount} FCFA</span>
                    {p.receipt && <button className="text-blue-500"><Download className="w-3.5 h-3.5" /></button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 3 && (
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-600 mb-2">Messages de l'établissement</div>
            {[
              { from: 'Direction', msg: 'Conseil de classe du Trimestre 3 : vendredi 27 juin à 16h. Votre présence est souhaitée.', time: 'Aujourd\'hui', read: false },
              { from: 'M. Boubacar (Maths)', msg: 'Aïchatou a fait un excellent travail sur le contrôle de la semaine dernière. Continuez à l\'encourager !', time: 'Hier', read: true },
              { from: 'Surveillance', msg: 'Rappel : les cours se terminent à 13h le vendredi 20 juin.', time: '17 Juin', read: true },
            ].map((m, i) => (
              <div key={i} className={`p-3 rounded-xl border text-xs transition-all ${!m.read ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-semibold ${!m.read ? 'text-blue-800' : 'text-slate-700'}`}>{m.from}</span>
                  <span className="text-slate-400">{m.time}</span>
                </div>
                <p className={`leading-relaxed ${!m.read ? 'text-blue-700' : 'text-slate-500'}`}>{m.msg}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TeacherMockup() {
  const [view, setView] = useState<'appel'|'notes'|'agenda'>('appel');
  const [absents, setAbsents] = useState<number[]>([1]);

  const students = ['Aïchatou Moussa', 'Moussa Abdou', 'Fatouma Seyni', 'Issoufou Hamidou', 'Halima Inoussa', 'Souleymane Badié'];

  return (
    <div className="mx-auto w-full max-w-xs">
      {/* Phone frame */}
      <div className="bg-slate-800 rounded-[2.5rem] p-2.5 shadow-2xl">
        <div className="bg-white rounded-[2rem] overflow-hidden">
          {/* Status bar */}
          <div className="bg-slate-900 px-5 pt-3 pb-1.5 flex items-center justify-between">
            <span className="text-white text-xs font-mono">09:41</span>
            <div className="w-14 h-3.5 bg-slate-700 rounded-full"></div>
            <div className="flex items-center space-x-1">
              <Signal className="w-3 h-3 text-white" />
              <Wifi className="w-3 h-3 text-white" />
              <Battery className="w-3 h-3 text-white" />
            </div>
          </div>

          {/* App header */}
          <div className="bg-slate-900 px-4 pb-4 pt-2">
            <div className="flex items-center justify-between mb-1">
              <div>
                <div className="text-xs text-slate-400">Lycée Malam Issa</div>
                <div className="text-sm font-bold text-white">M. Boubacar Ali</div>
              </div>
              <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-xs font-bold text-slate-900">BA</div>
            </div>
            <div className="flex space-x-1 mt-3">
              {(['appel', 'notes', 'agenda'] as const).map((v) => (
                <button key={v} onClick={() => setView(v)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all capitalize ${view === v ? 'bg-amber-400 text-slate-900' : 'bg-white/10 text-slate-400'}`}>
                  {v === 'appel' ? 'Appel' : v === 'notes' ? 'Notes' : 'Agenda'}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 min-h-[300px]">
            {view === 'appel' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">3ème A — Mathématiques</div>
                    <div className="text-xs text-slate-400">Lundi 19 juin · 8h00 — 9h30</div>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">{6 - absents.length}/6</span>
                </div>
                <div className="space-y-1.5 mb-4">
                  {students.map((s, i) => (
                    <button key={i} onClick={() => setAbsents(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-xs ${absents.includes(i) ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'}`}>
                      <div className="flex items-center space-x-2.5">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${absents.includes(i) ? 'bg-rose-200 text-rose-700' : 'bg-emerald-200 text-emerald-700'}`}>
                          {s.charAt(0)}
                        </div>
                        <span className={absents.includes(i) ? 'text-rose-700 line-through' : 'text-slate-800'}>{s}</span>
                      </div>
                      <span className={`font-semibold ${absents.includes(i) ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {absents.includes(i) ? 'ABS' : 'P'}
                      </span>
                    </button>
                  ))}
                </div>
                <button className="w-full py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Valider — SMS parents en 15 min</span>
                </button>
              </div>
            )}

            {view === 'notes' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">Contrôle n°4 — Algèbre</div>
                    <div className="text-xs text-slate-400">3ème A · Saisie rapide</div>
                  </div>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">3/6 saisis</span>
                </div>
                <div className="space-y-1.5 mb-4">
                  {[
                    { name: 'Aïchatou Moussa', note: 16 },
                    { name: 'Moussa Abdou', note: 7 },
                    { name: 'Fatouma Seyni', note: 18 },
                    { name: 'Issoufou Hamidou', note: null },
                    { name: 'Halima Inoussa', note: null },
                    { name: 'Souleymane Badié', note: null },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                      <span className="text-slate-700 truncate flex-1">{s.name}</span>
                      <div className={`w-14 border rounded-lg px-2 py-1 font-mono font-bold text-center ${s.note !== null ? (s.note >= 10 ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700') : 'border-slate-200 bg-white text-slate-300'}`}>
                        {s.note !== null ? `${s.note}/20` : '—/20'}
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full py-2.5 bg-amber-400 text-slate-900 text-xs font-bold rounded-xl">
                  Enregistrer les notes
                </button>
              </div>
            )}

            {view === 'agenda' && (
              <div>
                <div className="text-xs font-semibold text-slate-800 mb-3">Semaine du 16 juin 2026</div>
                <div className="space-y-2">
                  {[
                    { day: 'Lundi 19', time: '08h–09h30', class: '3ème A', subject: 'Mathématiques', room: 'Salle 4' },
                    { day: 'Lundi 19', time: '10h–11h30', class: '2nde B', subject: 'Mathématiques', room: 'Salle 7' },
                    { day: 'Mercredi 21', time: '08h–09h30', class: 'Tle D', subject: 'Mathématiques', room: 'Salle 2' },
                    { day: 'Jeudi 22', time: '14h–15h30', class: '3ème A', subject: 'Mathématiques', room: 'Salle 4' },
                  ].map((c, i) => (
                    <div key={i} className="flex items-start space-x-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                      <div className="w-14 shrink-0">
                        <div className="font-semibold text-slate-800 text-xs leading-tight">{c.day}</div>
                        <div className="text-slate-400 text-xs">{c.time}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{c.class} — {c.subject}</div>
                        <div className="text-slate-400 flex items-center space-x-1"><MapPin className="w-2.5 h-2.5" /><span>{c.room}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
                  <strong>Note :</strong> Vous enseignez dans 2 établissements cette semaine. Emploi du temps synchronisé automatiquement.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────

export default function App() {
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [students, setStudents] = useState(520);
  const [tuition, setTuition] = useState(85000);
  const [unpaid, setUnpaid] = useState(18);
  const leakage = useMemo(() => Math.round(students * tuition * (unpaid / 100)), [students, tuition, unpaid]);
  const wastedHours = useMemo(() => Math.round(students * 10), [students]);
  const recovered = useMemo(() => Math.round(leakage * 0.85), [leakage]);
  const savedDays = useMemo(() => Math.round(wastedHours * 0.8 / 8), [wastedHours]);

  const [pain, setPain] = useState(0);
  const [scenario, setScenario] = useState(0);
  const [notif, setNotif] = useState<'fees'|'absent'|'homework'|'praise'>('fees');
  const [aiRunning, setAiRunning] = useState(false);
  const [aiLogs, setAiLogs] = useState<string[]>([]);
  const [aiDone, setAiDone] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState(NIGER_PREFIX);
  const [schoolName, setSchoolName] = useState('');
  const [studentRange, setStudentRange] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  /** Candidatures réellement présentes dans Google Sheets (compteur partagé) */
  const [sheetCount, setSheetCount] = useState<number | null>(null);
  /** Numéro de Fondateur renvoyé par la feuille */
  const [ticket, setTicket] = useState<number | null>(null);

  const [pioneers, setPioneers] = useState<any[]>(() => {
    const s = localStorage.getItem('schoolos_founders_v3');
    return s ? JSON.parse(s) : [
      { name: "M. Moussa Issoufou", school: "Complexe Scolaire Sahel", country: "Niger" },
      { name: "Mme Fatouma Maïga", school: "Institut Privé Ibn Battouta", country: "Niger" },
    ];
  });

  /**
   * Nombre de Fondateurs — LA FEUILLE GOOGLE SHEETS EST LA SEULE SOURCE DE VÉRITÉ.
   * Le localStorage n'influence plus le compteur : il sert uniquement à
   * afficher la candidature de CE visiteur dans la liste d'exemple.
   */
  const foundersCount = sheetCount ?? 0;
  const placesLeft = PLACES_TOTAL - foundersCount;
  /** Référence affichée sur l'écran de confirmation */
  const founderRef = String(ticket ?? foundersCount).padStart(2, '0');
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
  const total = SLIDES_DATA.length;
  const progress = ((slide + 1) / total) * 100;

  useEffect(() => {
    if (!isPlaying) return;
    const t = setInterval(() => setSlide(p => (p + 1) % total), 8000);
    return () => clearInterval(t);
  }, [isPlaying, total]);


  const runAi = () => {
    if (aiRunning) return;
    setAiRunning(true); setAiLogs([]); setAiDone(false);
    const logs = [
      "Connexion à la base de données de l'établissement...",
      "Chargement de 487 dossiers élèves — Lycée Malam Issa, Niamey...",
      "Analyse des patterns d'absences — corrélation avec les notes...",
      "⚠ SIGNAL FORT — Moussa Abdou (3è A) : 3 absences mardi matin × baisse 6pts maths",
      "⚠ SIGNAL MOYEN — Halima Inoussa (2nde C) : devoirs non rendus × 4 semaines",
      "Optimisation emploi du temps — Trimestre 3 (Tle D & C)...",
      "Génération de 47 appréciations automatiques en cours...",
      "✓ Rapport complet compilé — 3 profils à risque · Emploi du temps optimisé en 18 secondes."
    ];
    let i = 0;
    const iv = setInterval(() => {
      if (i < logs.length) { setAiLogs(p => [...p, logs[i]]); i++; }
      else { clearInterval(iv); setAiRunning(false); setAiDone(true); }
    }, 820);
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;

    setSending(true);
    setSendError('');

    // Numéro WhatsApp complet ? (8 chiffres après le préfixe +227)
    if (!isCompleteNigerNumber(whatsapp)) {
      setSending(false);
      setSendError('Numéro WhatsApp incomplet : saisissez les 8 chiffres après +227 (ex. +227 87 72 75 01).');
      return;
    }

    // Enregistrement dans Google Sheets via Apps Script
    const result = await sendCandidature({
      name: name.trim(),
      school: schoolName.trim(),
      whatsapp: whatsapp.trim(),
      email: email.trim(),
      students: studentRange || 'non précisé',
      country: 'Niger',
      source: 'presentation',
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
    // Le compteur suit la feuille : le numéro attribué = nouveau total enregistré
    if (typeof result.number === 'number') setSheetCount(result.number);

    const p = { name, school: schoolName, country: '—', students: studentRange, whatsapp, email };
    const list = [p, ...pioneers];
    setPioneers(list);
    localStorage.setItem('schoolos_founders_v3', JSON.stringify(list));
    setSubmitted(true);
  };

  // Nombre de candidatures déjà dans la feuille Google Sheets (places restantes réelles)
  useEffect(() => {
    let alive = true;
    fetchCandidatureCount().then((count) => {
      if (alive && count !== null) setSheetCount(count);
    });
    return () => { alive = false; };
  }, []);

  const goNext = () => setSlide(p => Math.min(p + 1, total - 1));
  const goPrev = () => setSlide(p => Math.max(p - 1, 0));

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ─── HEADER (bloc fixe : en-tête + progression) ─── */}
      <div className="sticky top-0 z-50 bg-white">
      <header className="bg-white border-b border-slate-100 px-5 md:px-10 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center shrink-0">
            <School className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-900 text-sm">School<span className="text-amber-500">OS</span></span>
            <span className="hidden sm:block h-4 w-px bg-slate-200"></span>
            <span className="hidden sm:block text-xs text-slate-400">Programme Fondateurs 2026</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-xs font-semibold bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1.5">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
            </span>
            <span>{placesLeft} place{placesLeft > 1 ? 's' : ''} / {PLACES_TOTAL}</span>
          </div>
          <button onClick={() => navigate('/')}
            className="hidden sm:flex items-center space-x-1.5 text-sm border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 font-medium px-3 py-2 rounded-lg transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>Accueil</span>
          </button>
          <button onClick={() => setSlide(total - 1)}
            className="hidden sm:flex items-center space-x-1.5 text-sm bg-slate-900 hover:bg-slate-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
            <span>Candidater</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-0.5 bg-slate-100">
        <div className="h-full bg-amber-400 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>
      </div>

      {/* ─── MAIN ─── */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 w-full max-w-6xl mx-auto px-5 md:px-12 py-10 md:py-14 flex flex-col">

          {/* Badge */}
          <div className="mb-4">
            <span className="inline-flex items-center text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
              {SLIDES_DATA[slide].badge}
            </span>
          </div>

          {/* Title */}
          <div className="mb-7 max-w-4xl">
            <h1 className="text-2xl md:text-4xl lg:text-[2.6rem] font-bold text-slate-900 leading-tight tracking-tight mb-3">
              {SLIDES_DATA[slide].title}
            </h1>
            <p className="text-base md:text-lg text-slate-500 leading-relaxed font-light max-w-3xl">
              {SLIDES_DATA[slide].subtitle}
            </p>
          </div>

          {/* ══ CONTENT ══ */}
          <div className="flex-1">

            {/* ══════════════════════════════════════════════════
                SLIDE 1 — COVER
            ══════════════════════════════════════════════════ */}
            {slide === 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
                <div className="lg:col-span-3 space-y-5">
                  <div className="space-y-2">
                    {[
                      { icon: CreditCard, problem: 'Frais scolaires payés en cash, sans reçu, sans suivi', fix: 'Relances automatiques et paiements tracés' },
                      { icon: Clock,       problem: 'Bulletins calculés à la main 3 semaines par trimestre', fix: 'Bulletins générés en quelques secondes, PDF prêt à imprimer' },
                      { icon: Users,       problem: 'Parents informés uniquement à la remise des bulletins', fix: 'SMS & WhatsApp instantanés — absences, notes, devoirs' },
                      { icon: Database,    problem: 'Données éparpillées entre cahiers, Excel et WhatsApp', fix: 'Un seul système. Tout centralisé. Accessible partout.' },
                      { icon: TrendingDown,problem: 'Décrochage découvert au conseil de classe — trop tard', fix: 'IA détecte les élèves en danger des semaines avant' },
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3.5 bg-white border border-slate-100 rounded-xl hover:border-amber-200 hover:shadow-sm transition-all group gap-2 sm:gap-0">
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <div className="p-2 bg-rose-50 rounded-lg shrink-0 group-hover:bg-amber-50 transition-colors">
                            <item.icon className="w-4 h-4 text-rose-400 group-hover:text-amber-500 transition-colors" />
                          </div>
                          <span className="text-sm text-slate-400 line-through truncate">{item.problem}</span>
                        </div>
                        <div className="flex items-center space-x-2 sm:ml-3 sm:shrink-0">
                          <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                          <span className="text-sm text-emerald-700 font-medium leading-tight">{item.fix}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setSlide(total - 1)}
                    className="flex items-center space-x-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-6 py-3 rounded-xl transition-colors text-sm w-fit shadow-sm shadow-amber-200">
                    <span>Rejoindre le Programme Fondateurs</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { val: 'Centralisé', label: 'une seule base pour toute l\'école' },
                      { val: 'Quelques secondes', label: 'pour générer un bulletin' },
                      { val: 'Automatique', label: 'relances SMS & WhatsApp' },
                      { val: 'Temps réel', label: 'trésorerie et recouvrement' },
                    ].map((s, i) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-xl text-center border border-slate-100">
                        <div className={`font-bold text-slate-900 ${s.val.length > 12 ? 'text-base leading-tight' : 'text-2xl'}`}>{s.val}</div>
                        <div className="text-xs text-slate-500 mt-1 leading-tight">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="p-5 bg-slate-900 rounded-2xl text-white">
                    <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3">Places Fondateurs disponibles</div>
                    <div className="flex items-end space-x-2 mb-2">
                      <span className="text-5xl font-bold text-amber-400">{placesLeft}</span>
                      <span className="text-slate-400 text-sm pb-1.5">/ {PLACES_TOTAL} places</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5 mb-2">
                      <div className="bg-amber-400 h-1.5 rounded-full transition-all" style={{ width: `${((PLACES_TOTAL - placesLeft) / PLACES_TOTAL) * 100}%` }} />
                    </div>
                    <p className="text-xs text-slate-400">{PLACES_TOTAL - placesLeft} établissements déjà inscrits. 12 mois gratuits + accompagnement premium inclus.</p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-start space-x-3">
                    <div className="w-9 h-9 bg-amber-400 rounded-lg flex items-center justify-center text-slate-900 text-xs font-bold shrink-0">SL</div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">SmartLimb — Niamey, Niger</div>
                      <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">Startup technologique fondée par des Africains pour digitaliser les institutions d'Afrique francophone.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ SLIDE 2 : ROI CALCULATOR ═══ */}
            {slide === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-5">
                    <h3 className="text-sm font-semibold text-slate-700">Les paramètres de votre établissement</h3>
                    {[
                      { label: "Nombre d'élèves inscrits", val: students, set: setStudents, min: 50, max: 3000, step: 50, fmt: (v: number) => `${v} élèves` },
                      { label: "Frais annuel moyen par élève", val: tuition, set: setTuition, min: 30000, max: 500000, step: 5000, fmt: (v: number) => `${v.toLocaleString('fr-FR')} FCFA` },
                      { label: "Taux d'impayés / retards estimé", val: unpaid, set: setUnpaid, min: 5, max: 45, step: 1, fmt: (v: number) => `${v}%` },
                    ].map((s, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm text-slate-600">{s.label}</label>
                          <span className={`text-sm font-bold font-mono ${i === 2 ? 'text-rose-600' : 'text-slate-800'}`}>{s.fmt(s.val)}</span>
                        </div>
                        <input type="range" min={s.min} max={s.max} step={s.step} value={s.val}
                          onChange={e => s.set(parseInt(e.target.value))}
                          className="w-full accent-amber-400 h-1.5 rounded-lg cursor-pointer" />
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-3">
                    <Zap className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <span className="font-semibold text-emerald-800">Coût SchoolOS — Année 1 Fondateur :</span>
                      <span className="text-emerald-700 font-bold text-xl ml-2">0 FCFA</span>
                      <p className="text-xs text-emerald-600 mt-0.5">Accès complet, intégration, formation inclus. 100% gratuit la première année.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-5 bg-rose-50 border border-rose-200 rounded-2xl">
                    <div className="text-xs font-semibold text-rose-500 uppercase tracking-wide mb-1">Ce que vous perdez chaque année</div>
                    <div className="text-4xl font-bold text-rose-600 font-mono">−{leakage.toLocaleString('fr-FR')}</div>
                    <div className="text-sm text-rose-400 font-mono">FCFA en frais non recouvrés</div>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">Trésorerie bloquée : familles qui paient en retard ou en cash sans suivi. Sans système de relance automatique, cet argent dort — ou disparaît.</p>
                  </div>
                  <div className="p-5 bg-orange-50 border border-orange-200 rounded-2xl">
                    <div className="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-1">Temps perdu en tâches manuelles</div>
                    <div className="text-4xl font-bold text-orange-600 font-mono">{wastedHours.toLocaleString('fr-FR')}</div>
                    <div className="text-sm text-orange-400 font-mono">heures / an perdues sur le terrain</div>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">Bulletins au stylo, appels de relance, double-saisie des notes, recherche de dossiers papier. Vos équipes méritent mieux.</p>
                  </div>
                  <div className="p-5 bg-slate-900 rounded-2xl text-white">
                    <div className="flex items-center space-x-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Avec SchoolOS — dès les 3 premiers mois</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-emerald-400 font-mono">+{recovered.toLocaleString('fr-FR')}</div>
                        <div className="text-xs text-slate-400 mt-0.5">FCFA récupérés</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-amber-400 font-mono">+{savedDays}</div>
                        <div className="text-xs text-slate-400 mt-0.5">jours de travail sauvés</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ SLIDE 3 : PAIN POINTS ═══ */}
            {slide === 2 && (
              <div className="space-y-4">
                <p className="text-sm text-slate-400">Cliquez sur un problème pour voir son impact financier réel :</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      id: 0, icon: Database,
                      label: "L'enfer des fichiers Excel",
                      short: "Notes sur un carnet, bulletins dans Excel, paiements sur un cahier. Personne n'a la même version.",
                      impact: "Les enseignants passent des heures chaque semaine à ressaisir des données qui existent déjà ailleurs. Les erreurs de calcul sur les bulletins génèrent des conflits avec les parents. Vos archives papier n'ont aucune valeur de sauvegarde.",
                      cost: "Des heures de double saisie chaque semaine"
                    },
                    {
                      id: 1, icon: CreditCard,
                      label: "Les impayés qui s'accumulent",
                      short: "Des familles paient en 3 ou 4 fois, en cash, sans reçu fiable. Le suivi est impossible.",
                      impact: "À la fin de l'année, votre comptable découvre qu'une partie des frais n'a pas été intégralement réglée. Sans suivi ni relance, certains retards s'éternisent. La trésorerie en souffre — et parfois, les salaires des enseignants aussi.",
                      cost: "Des revenus réels non recouvrés"
                    },
                    {
                      id: 2, icon: Users,
                      label: "Les parents dans le noir",
                      short: "Les familles attendent 3 mois pour savoir si leur enfant est en difficulté.",
                      impact: "Quand un parent reçoit le bulletin en fin de trimestre avec 7/20 en maths, il est en colère — et il a raison. Il n'a rien vu venir. Cette colère se transforme en départ vers l'établissement d'à côté, ou en bouche-à-oreille négatif.",
                      cost: "Chaque départ = une scolarité entière perdue"
                    },
                    {
                      id: 3, icon: Clock,
                      label: "La bureaucratie qui étouffe tout",
                      short: "Vos secrétaires et vos profs passent plus de temps à remplir des registres qu'à enseigner.",
                      impact: "Bulletins au stylo, appels de relance, double-saisie des notes, recherche de dossiers papier : les tâches manuelles s'accumulent d'autant plus que l'établissement grandit. Ce sont des heures que vos équipes pourraient consacrer aux élèves et aux parents.",
                      cost: "Des centaines d'heures de travail manuel par an"
                    }
                  ].map(p => (
                    <div key={p.id} onClick={() => setPain(p.id)}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${pain === p.id ? 'border-slate-900 bg-slate-900 shadow-xl' : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'}`}>
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`p-2.5 rounded-xl ${pain === p.id ? 'bg-amber-400/20' : 'bg-slate-100'}`}>
                          <p.icon className={`w-4 h-4 ${pain === p.id ? 'text-amber-400' : 'text-slate-500'}`} />
                        </div>
                        <h3 className={`font-semibold text-sm ${pain === p.id ? 'text-white' : 'text-slate-800'}`}>{p.label}</h3>
                      </div>
                      <p className={`text-xs leading-relaxed ${pain === p.id ? 'text-slate-400' : 'text-slate-500'}`}>{p.short}</p>
                      {pain === p.id && (
                        <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                          <p className="text-sm text-slate-200 leading-relaxed">{p.impact}</p>
                          <span className="inline-flex items-center space-x-1.5 text-xs font-medium bg-rose-500/20 text-rose-300 px-3 py-1 rounded-full">
                            <AlertTriangle className="w-3 h-3" />
                            <span>{p.cost}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════
                SLIDE 4 — DASHBOARD DIRECTION (solution overview)
            ══════════════════════════════════════════════════ */}
            {slide === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-4 space-y-3">
                  {[
                    { icon: BarChart3,  title: "Trésorerie en direct",         desc: "Taux de recouvrement, impayés par famille, encaissements du jour — mis à jour en temps réel. Zéro Excel." },
                    { icon: Users,      title: "Gestion des élèves",           desc: "Inscriptions, dossiers, notes, absences, bulletins PDF — tout centralisé en un profil unique par élève." },
                    { icon: Smartphone, title: "Portail parent & enseignant",  desc: "Chaque acteur a son interface dédiée. Notifications SMS/WhatsApp sans app à installer." },
                    { icon: Cpu,        title: "IA embarquée",                 desc: "Détection décrochage, emploi du temps optimisé, appréciations auto — intégré nativement." },
                  ].map((item, i) => (
                    <div key={i} className={`p-4 rounded-xl border transition-all ${i === 0 ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-100 hover:border-amber-200'}`}>
                      <div className="flex items-start space-x-3">
                        <item.icon className={`w-4 h-4 shrink-0 mt-0.5 ${i === 0 ? 'text-amber-400' : 'text-slate-400'}`} />
                        <div>
                          <div className={`text-sm font-semibold ${i === 0 ? 'text-white' : 'text-slate-800'}`}>{item.title}</div>
                          <div className={`text-xs mt-0.5 leading-relaxed ${i === 0 ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-2">
                    <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-700"><strong>Données souveraines.</strong> Hébergées en Afrique. Exportables à tout instant. Elles vous appartiennent à 100%.</p>
                  </div>
                </div>
                <div className="lg:col-span-8 overflow-x-auto">
                  <DashboardMockup />
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════
                SLIDE 5 — ENSEIGNANT MOBILE
            ══════════════════════════════════════════════════ */}
            {slide === 4 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-5 space-y-3">
                  <div className="space-y-2.5">
                    {[
                      { icon: Users,     title: 'Appel en 3 taps',              desc: 'L\'enseignant coche les absents pendant l\'appel. Le SMS part automatiquement aux parents dans les 15 minutes.' },
                      { icon: PenLine,   title: 'Saisie des notes sur mobile',   desc: 'Notes rentrées directement après le contrôle. Moyennes calculées en temps réel. Aucun doublon de saisie.' },
                      { icon: Calendar,  title: 'Emploi du temps synchronisé',   desc: 'L\'enseignant travaille dans plusieurs établissements ? Son agenda est synchronisé sur un seul outil.' },
                      { icon: BookOpen,  title: 'Cahier de texte numérique',     desc: 'Devoirs et activités saisis en 10 secondes. Accessibles par les élèves et les parents immédiatement.' },
                    ].map((item, i) => (
                      <div key={i} className={`p-4 rounded-xl border transition-all ${i === 0 ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-100 hover:border-amber-200'}`}>
                        <div className="flex items-start space-x-3">
                          <item.icon className={`w-4 h-4 shrink-0 mt-0.5 ${i === 0 ? 'text-amber-400' : 'text-slate-400'}`} />
                          <div>
                            <div className={`text-sm font-semibold ${i === 0 ? 'text-white' : 'text-slate-800'}`}>{item.title}</div>
                            <div className={`text-xs mt-0.5 leading-relaxed ${i === 0 ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-2">
                    <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-700"><strong className="text-amber-700">Zéro formation.</strong> Interface testée avec des enseignants non-techniciens. Prise en main complète en moins de 10 minutes.</p>
                  </div>
                </div>
                <div className="lg:col-span-7 flex justify-center">
                  <div className="w-full max-w-xs mx-auto sm:max-w-none">
                    <TeacherMockup />
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════
                SLIDE 6 — PORTAIL PARENT (portail complet + notifs fusionnés)
            ══════════════════════════════════════════════════ */}
            {slide === 5 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-5 space-y-3">
                  <div className="space-y-2.5">
                    {[
                      { icon: BarChart3,     title: 'Vue complète de l\'enfant',  desc: 'Moyenne générale, rang dans la classe, matières fortes et faibles — tout en un coup d\'œil depuis le portail.' },
                      { icon: Bell,          title: 'Alertes instantanées',       desc: 'Absence, retard, félicitations, message d\'enseignant — reçus en temps réel sur WhatsApp ou SMS, sans app.' },
                      { icon: CreditCard,    title: 'Suivi des paiements',        desc: 'Historique des versements, reçus PDF téléchargeables. Fini les litiges sur ce qui a été payé ou non.' },
                      { icon: MessageSquare, title: 'Messagerie directe',         desc: 'Le parent écrit à la direction ou à un enseignant. Fini les déplacements pour un simple mot.' },
                    ].map((item, i) => (
                      <div key={i} className={`p-4 rounded-xl border transition-all ${i === 0 ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-100 hover:border-amber-200'}`}>
                        <div className="flex items-start space-x-3">
                          <item.icon className={`w-4 h-4 shrink-0 mt-0.5 ${i === 0 ? 'text-amber-400' : 'text-slate-400'}`} />
                          <div>
                            <div className={`text-sm font-semibold ${i === 0 ? 'text-white' : 'text-slate-800'}`}>{item.title}</div>
                            <div className={`text-xs mt-0.5 leading-relaxed ${i === 0 ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-2">
                    <Globe className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-700"><strong className="text-emerald-700">Accessible sans app.</strong> Depuis n'importe quel téléphone via le navigateur. Notifications SMS & WhatsApp pour ceux qui préfèrent.</p>
                  </div>
                </div>
                <div className="lg:col-span-7 overflow-x-auto">
                  <ParentPortalMockup />
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════
                SLIDE 7 — ONBOARDING & ARCHIVE
            ══════════════════════════════════════════════════ */}
            {slide === 6 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-4 space-y-3">
                  <div className="space-y-2.5">
                    {[
                      { icon: Camera,     title: 'Scan instantané à l\'inscription', desc: 'Photo, acte de naissance, ancien bulletin — scannés depuis un smartphone en quelques secondes.' },
                      { icon: Archive,    title: 'Archive permanente',               desc: 'Chaque document conservé indéfiniment. Un bulletin de 2019 retrouvable en 30 secondes, même si l\'élève est sorti depuis.' },
                      { icon: FolderOpen, title: 'Dossier élève complet',            desc: 'Notes, absences, bulletins, paiements, documents officiels — tout centralisé dans un seul profil.' },
                      { icon: Download,   title: 'Re-téléchargement à vie',          desc: 'Un parent perd un bulletin ? Il le retélécharge depuis son portail. La secrétaire n\'a rien à chercher.' },
                    ].map((item, i) => (
                      <div key={i} className={`p-4 rounded-xl border transition-all ${i === 0 ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-100 hover:border-amber-200'}`}>
                        <div className="flex items-start space-x-3">
                          <item.icon className={`w-4 h-4 shrink-0 mt-0.5 ${i === 0 ? 'text-amber-400' : 'text-slate-400'}`} />
                          <div>
                            <div className={`text-sm font-semibold ${i === 0 ? 'text-white' : 'text-slate-800'}`}>{item.title}</div>
                            <div className={`text-xs mt-0.5 leading-relaxed ${i === 0 ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-700"><strong className="text-rose-700">Au Niger, les documents se perdent.</strong> Inondations, déménagements, incendies. Avec SchoolOS, le dossier numérique ne disparaît jamais.</p>
                  </div>
                </div>
                <div className="lg:col-span-8 overflow-x-auto">
                  <OnboardingMockup />
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════
                SLIDE 8 — AVANT / APRÈS
            ══════════════════════════════════════════════════ */}
            {slide === 7 && (
              <div className="space-y-5">
                <div className="flex flex-wrap gap-2">
                  {["Génération des bulletins", "Recouvrement des frais", "Gestion des absences"].map((s, i) => (
                    <button key={i} onClick={() => setScenario(i)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${scenario === i ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
                      {s}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {scenario === 0 && (
                    <>
                      <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl">
                        <div className="inline-block text-xs font-semibold text-rose-600 bg-rose-100 border border-rose-200 rounded-full px-3 py-1 mb-3">Aujourd'hui — Sans SchoolOS</div>
                        <p className="text-sm text-slate-600 leading-relaxed mb-4">Fin de trimestre : 2 semaines de chaos. Chaque enseignant calcule les moyennes à la main ou sur son propre Excel. Les secrétaires recopient tout à la main sur les bulletins. Les coquilles sont fréquentes. Les parents se plaignent. Et les bulletins ne sont distribués qu'une semaine après la fin des cours.</p>
                        <div className="space-y-1.5">
                          {['2–3 semaines de travail', 'Erreurs de calcul fréquentes', 'Bulletins sans identité visuelle', 'Parents mécontents'].map((item, i) => (
                            <div key={i} className="flex items-center space-x-2 text-xs text-rose-700 bg-rose-100 px-3 py-1.5 rounded-lg">
                              <span>×</span><span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
                          <Sparkles className="w-3 h-3" /><span>Avec SchoolOS — quelques secondes</span>
                        </div>
                        <BulletinMockup />
                      </div>
                    </>
                  )}
                  {scenario === 1 && (
                    <>
                      <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl">
                        <div className="inline-block text-xs font-semibold text-rose-600 bg-rose-100 border border-rose-200 rounded-full px-3 py-1 mb-3">Aujourd'hui — Sans SchoolOS</div>
                        <p className="text-sm text-slate-600 leading-relaxed mb-4">Les parents paient en cash au portail, ou envoient leur enfant avec l'argent dans l'enveloppe. Il n'y a pas toujours de reçu. Le suivi se fait sur un cahier. En fin d'année, personne ne sait vraiment qui a tout payé. Les relances se font par appels téléphoniques — souvent sans réponse.</p>
                        <div className="space-y-1.5">
                          {['Paiements cash non tracés', 'Pas de reçus officiels', 'Relances manuelles épuisantes', 'Trésorerie impossible à lire'].map((item, i) => (
                            <div key={i} className="flex items-center space-x-2 text-xs text-rose-700 bg-rose-100 px-3 py-1.5 rounded-lg">
                              <span>×</span><span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="p-6 bg-slate-900 rounded-2xl text-white">
                        <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/30 rounded-full px-3 py-1 mb-4">
                          <Sparkles className="w-3 h-3" /><span>Avec SchoolOS</span>
                        </div>
                        <div className="space-y-3">
                          {[
                            { step: '1', text: 'Le parent reçoit un SMS avec le montant exact et les modalités de paiement' },
                            { step: '2', text: 'Il paie en ligne ou en cash à la caisse — le reçu PDF est généré instantanément' },
                            { step: '3', text: 'La direction voit le taux de recouvrement mis à jour en temps réel sur son tableau de bord' },
                            { step: '4', text: 'Les familles en retard reçoivent des relances automatiques et polies — sans intervention humaine' },
                          ].map((item, i) => (
                            <div key={i} className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center text-xs font-bold text-slate-900 shrink-0">{item.step}</div>
                              <p className="text-sm text-slate-300 leading-relaxed">{item.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  {scenario === 2 && (
                    <>
                      <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl">
                        <div className="inline-block text-xs font-semibold text-rose-600 bg-rose-100 border border-rose-200 rounded-full px-3 py-1 mb-3">Aujourd'hui — Sans SchoolOS</div>
                        <p className="text-sm text-slate-600 leading-relaxed mb-4">L'enseignant note les absents sur son cahier. Ce soir, il remet la liste à la surveillance générale. Le lendemain, un surveillant appelle les parents — s'il a le temps. Le parent apprend l'absence 2–3 jours après. Le décrochage est déjà installé.</p>
                        <div className="space-y-1.5">
                          {['Délai de 2–3 jours avant information', 'Aucune corrélation absence × notes', 'Décrochage découvert trop tard', 'Parents frustrés de ne pas savoir'].map((item, i) => (
                            <div key={i} className="flex items-center space-x-2 text-xs text-rose-700 bg-rose-100 px-3 py-1.5 rounded-lg">
                              <span>×</span><span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="p-6 bg-slate-900 rounded-2xl text-white">
                        <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/30 rounded-full px-3 py-1 mb-4">
                          <Sparkles className="w-3 h-3" /><span>Avec SchoolOS — 15 minutes</span>
                        </div>
                        <div className="space-y-3">
                          {[
                            { step: '1', text: "L'enseignant coche les absents sur son mobile pendant l'appel, en classe" },
                            { step: '2', text: "Le parent reçoit un SMS en 15 minutes : « Moussa a été absent ce matin »" },
                            { step: '3', text: "L'IA détecte automatiquement si un élève est souvent absent le même jour — signal prédictif de décrochage" },
                            { step: '4', text: "La direction reçoit une alerte si le pattern se répète — et peut agir avant l'échec" },
                          ].map((item, i) => (
                            <div key={i} className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center text-xs font-bold text-slate-900 shrink-0">{item.step}</div>
                              <p className="text-sm text-slate-300 leading-relaxed">{item.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════
                SLIDE 9 — IA
            ══════════════════════════════════════════════════ */}
            {slide === 8 && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { icon: Target, title: 'Détection précoce du décrochage', desc: 'L\'IA croise absences, notes et comportements pour identifier les élèves en danger des semaines avant les examens — et déclenche une alerte à la direction.', dark: true },
                    { icon: BarChart3, title: 'Emploi du temps optimisé', desc: 'L\'algorithme génère l\'emploi du temps idéal — sans conflit de salles, de profs ou de matières. Ce qui prenait 2 jours se fait en 18 secondes.', dark: false },
                    { icon: MessageSquare, title: 'Appréciations automatiques', desc: 'Des appréciations contextuelles et personnalisées générées pour chaque élève selon ses vrais résultats. Vos enseignants gagnent des heures chaque trimestre.', dark: false },
                  ].map((item, i) => (
                    <div key={i} className={`p-5 rounded-2xl ${item.dark ? 'bg-slate-900 text-white' : 'bg-slate-50 border border-slate-200'}`}>
                      <item.icon className={`w-5 h-5 mb-3 ${item.dark ? 'text-amber-400' : 'text-slate-400'}`} />
                      <h4 className={`font-semibold text-sm mb-2 ${item.dark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h4>
                      <p className={`text-xs leading-relaxed ${item.dark ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* AI Console */}
                  <div className="bg-slate-900 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Cpu className="w-4 h-4 text-amber-400" />
                        <span className="text-sm font-semibold text-white">Démonstration — SchoolOS AI</span>
                      </div>
                      <button onClick={runAi} disabled={aiRunning}
                        className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-bold rounded-lg transition-colors disabled:opacity-50 cursor-pointer">
                        {aiRunning ? 'Analyse...' : '▶ Lancer'}
                      </button>
                    </div>
                    <div className="bg-black/60 rounded-xl p-3.5 min-h-[120px] font-mono text-xs space-y-1.5 max-h-[150px] overflow-y-auto">
                      {aiLogs.length === 0
                        ? <div className="text-slate-600 text-center pt-6">Cliquez sur "Lancer" pour voir l'IA en action.</div>
                        : aiLogs.map((log, i) => (
                          <div key={i} className="flex space-x-2.5 text-slate-300">
                            <span className="text-amber-400 shrink-0 w-4 text-right">{i + 1}</span>
                            <span className={log.startsWith('⚠') ? 'text-amber-300' : log.startsWith('✓') ? 'text-emerald-300' : ''}>{log}</span>
                          </div>
                        ))
                      }
                    </div>
                    {aiDone && (
                      <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center space-x-2 text-sm text-emerald-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span><strong className="text-white">3 profils à risque</strong> identifiés · Emploi du temps optimisé en <span className="text-amber-400 font-bold">18 secondes</span>.</span>
                      </div>
                    )}
                  </div>

                  {/* AI Alert Mockup */}
                  <AIAlertMockup />
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════
                SLIDE 10 — PROGRAMME FONDATEURS
            ══════════════════════════════════════════════════ */}
            {slide === 9 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="p-6 bg-slate-900 rounded-2xl text-white">
                    <div className="flex items-center space-x-2 mb-4">
                      <Award className="w-5 h-5 text-amber-400" />
                      <span className="text-sm font-bold text-amber-400 uppercase tracking-wide">Ce que vous obtenez — Fondateur</span>
                    </div>
                    <ul className="space-y-3">
                      {[
                        { bold: '12 mois gratuits',         rest: ' — accès complet, aucun abonnement en année 1.' },
                        { bold: 'Configuration initiale',   rest: ' — votre établissement paramétré, prêt à démarrer.' },
                        { bold: 'Formation incluse',        rest: ' — prise en main en 2h pour tous vos personnels.' },
                        { bold: '60 000 FCFA/an après l\'an 1', rest: ' — tarif Fondateur garanti pendant votre abonnement (moitié du tarif public).' },
                        { bold: 'Co-construction produit',  rest: ' — vos besoins guident directement notre roadmap.' },
                        { bold: 'Statut Fondateur officiel', rest: ' — votre établissement devient une référence SchoolOS dans votre pays.' },
                      ].map((item, i) => (
                        <li key={i} className="flex items-start space-x-2.5 text-sm">
                          <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span><strong className="text-white">{item.bold}</strong><span className="text-slate-400">{item.rest}</span></span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Client standard (après fermeture du programme)</div>
                    <ul className="space-y-2">
                      {['Abonnement payant dès le 1er mois (120 000 FCFA/an)', 'Aucun accompagnement au lancement', 'Tarif plein — aucune réduction', 'Aucune influence sur le produit'].map((item, i) => (
                        <li key={i} className="flex items-start space-x-2 text-sm text-slate-500">
                          <span className="text-rose-400 shrink-0">×</span><span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-5 border-2 border-amber-300 bg-amber-50 rounded-2xl">
                    <div className="flex items-end space-x-2 mb-2">
                      <span className="text-5xl font-bold text-amber-500">{placesLeft}</span>
                      <span className="text-slate-500 text-sm pb-1.5">places disponibles sur {PLACES_TOTAL}</span>
                    </div>
                    <div className="w-full bg-amber-200 rounded-full h-2 mb-3">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${((PLACES_TOTAL - placesLeft) / PLACES_TOTAL) * 100}%` }} />
                    </div>
                    <p className="text-xs text-amber-700 leading-relaxed">Les 20 places d'accompagnement sont attribuées manuellement. Une fois les 20 places comblées, le programme ferme définitivement.</p>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Établissements déjà inscrits</div>
                    {foundersList.map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl">
                        <div>
                          <div className="text-sm font-semibold text-slate-800">{p.school}</div>
                          <div className="text-xs text-slate-500">{p.name} · {p.country}</div>
                        </div>
                        <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">✓ Fondateur</span>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => setSlide(total - 1)}
                    className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl transition-colors text-sm">
                    <span>Sécuriser mon siège maintenant</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════
                SLIDE 11 — PROCHAINES ÉTAPES
            ══════════════════════════════════════════════════ */}
            {slide === 10 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[
                    {
                      step: '01', title: 'Votre candidature', timing: 'Aujourd\'hui — 60 secondes', dark: true,
                      items: ['Formulaire 4 champs — nom, école, WhatsApp, email', 'Aucun engagement financier à cette étape', 'Confirmation WhatsApp reçue dans les 24h'],
                    },
                    {
                      step: '02', title: 'Appel de qualification', timing: 'Dans les 48h suivant votre candidature', dark: false,
                      items: ['Appel de 30 min avec notre équipe', 'Présentation sur site si vous le souhaitez', 'Signature de la lettre d\'intention (LOI)'],
                    },
                    {
                      step: '03', title: 'Rentrée transformée', timing: 'Juillet–Août–Septembre 2026', dark: false,
                      items: ['Migration de toutes vos données existantes — offerte', 'Formation équipes en 2h chrono', 'Rentrée octobre — zéro friction, zéro stress'],
                    }
                  ].map((step, i) => (
                    <div key={i} className={`p-6 rounded-2xl ${step.dark ? 'bg-amber-400' : 'bg-slate-50 border border-slate-200'}`}>
                      <div className={`text-4xl font-mono font-bold mb-3 opacity-20 ${step.dark ? 'text-slate-900' : 'text-slate-900'}`}>{step.step}</div>
                      <h3 className={`font-bold text-base mb-1 ${step.dark ? 'text-slate-900' : 'text-slate-900'}`}>{step.title}</h3>
                      <div className={`text-xs mb-4 ${step.dark ? 'text-slate-700' : 'text-slate-500'}`}>{step.timing}</div>
                      <ul className="space-y-2">
                        {step.items.map((item, j) => (
                          <li key={j} className={`flex items-start space-x-2 text-sm ${step.dark ? 'text-slate-800' : 'text-slate-600'}`}>
                            <Check className={`w-4 h-4 shrink-0 mt-0.5 ${step.dark ? 'text-slate-900' : 'text-emerald-500'}`} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 bg-white border border-slate-200 rounded-2xl">
                    <h4 className="font-semibold text-slate-800 text-sm mb-4">Questions fréquentes</h4>
                    {[
                      { q: "C'est vraiment gratuit la 1re année ?", r: "Oui. Accès complet à la plateforme et formation des équipes — 0 FCFA en année 1 pour les 20 Fondateurs 2026. La migration de vos données est offerte à toutes les écoles. C'est notre investissement dans votre réussite et la co-construction du produit." },
                      { q: "Et si ça ne me convient pas après ?", r: "Aucun engagement de durée. Vous continuez parce que ça fonctionne, pas parce que vous êtes bloqué contractuellement." },
                      { q: "Nos données sont-elles sécurisées ?", r: "Hébergement cloud sécurisé. Vos données vous appartiennent à 100% et sont exportables à tout instant dans vos propres fichiers." },
                    ].map((faq, i) => (
                      <div key={i} className="py-3 border-b border-slate-100 last:border-0">
                        <div className="text-xs font-semibold text-slate-800 mb-1">{faq.q}</div>
                        <div className="text-xs text-slate-500 leading-relaxed">{faq.r}</div>
                      </div>
                    ))}
                  </div>

                  <div className="p-5 bg-slate-900 rounded-2xl text-white flex flex-col justify-between">
                    <div>
                      <Globe className="w-6 h-6 text-amber-400 mb-3" />
                      <h4 className="font-bold text-white text-sm mb-2">Notre ambition à 5 ans</h4>
                      <p className="text-sm text-slate-400 leading-relaxed">Équiper <strong className="text-white">10 000 établissements</strong> à travers l'Afrique francophone et accompagner la réussite de <strong className="text-white">5 millions d'élèves</strong>. Les Fondateurs 2026 seront les références de cette transformation historique.</p>
                    </div>
                    <div className="mt-5 flex space-x-6">
                      {[{ val: '10k+', label: 'Établissements' }, { val: '5M+', label: 'Élèves' }, { val: '15+', label: 'Pays' }].map((s, i) => (
                        <div key={i} className="text-center">
                          <div className="text-2xl font-bold text-amber-400">{s.val}</div>
                          <div className="text-xs text-slate-500">{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════
                SLIDE 12 — FORMULAIRE
            ══════════════════════════════════════════════════ */}
            {slide === 11 && (
              <div className="max-w-2xl mx-auto w-full">
                {!submitted ? (
                  <div className="space-y-5">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-4">
                      <div className="flex items-center space-x-2 text-sm text-amber-800">
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                        <span><strong>{placesLeft} place{placesLeft > 1 ? 's' : ''}</strong> disponible{placesLeft > 1 ? 's' : ''} sur {PLACES_TOTAL} — 12 mois gratuits · accompagnement premium inclus</span>
                      </div>
                      <div className="w-20 bg-amber-200 rounded-full h-1.5 shrink-0">
                        <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${((PLACES_TOTAL - placesLeft) / PLACES_TOTAL) * 100}%` }} />
                      </div>
                    </div>

                    {/* Pourquoi SchoolOS — réassurance avant la prise de contact */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <div className="flex items-start space-x-2.5">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-500 leading-relaxed">
                          <strong className="text-slate-800">Pourquoi SchoolOS ?</strong> Développé par SmartLimb au Niger, pour les réalités des
                          organisations africaines : priorité à la simplicité, à la sécurité des données et à l'adoption par les équipes.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['Produit développé à Niamey', 'Support local', 'Équipe technique locale'].map((t, i) => (
                          <span key={i} className="text-[10px] font-semibold text-slate-600 bg-white border border-slate-200 rounded-full px-2.5 py-1">{t}</span>
                        ))}
                      </div>
                    </div>

                    <form onSubmit={submitForm} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {([
                          { label: 'Votre nom complet *', val: name, set: setName, type: 'text', placeholder: 'ex : M. Ibrahim Issoufou' },
                          { label: 'Nom de l\'établissement *', val: schoolName, set: setSchoolName, type: 'text', placeholder: 'ex : Lycée Privé Malam Issa' },
                          { label: 'WhatsApp *', val: whatsapp, set: (v: string) => setWhatsapp(formatNigerInput(v)), type: 'text', placeholder: '+227 87 72 75 01', inputMode: 'numeric' as const },
                          { label: 'Email professionnel *', val: email, set: setEmail, type: 'email', placeholder: 'direction@ecole.ne' },
                        ] as { label: string; val: string; set: (v: string) => void; type: string; placeholder: string; inputMode?: 'numeric' }[]).map((f, i) => (
                          <div key={i}>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">{f.label}</label>
                            <input required value={f.val} onChange={e => f.set(e.target.value)} type={f.type} inputMode={f.inputMode} placeholder={f.placeholder}
                              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all placeholder:text-slate-300" />
                          </div>
                        ))}
                      </div>

                      {/* Nombre approximatif d'élèves — qualification du prospect */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nombre approximatif d'élèves *</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {STUDENT_RANGES.map((range, i) => (
                            <label key={range}
                              className={`flex items-center justify-center text-center px-3 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all focus-within:ring-2 focus-within:ring-amber-200 ${
                                studentRange === range
                                  ? 'bg-amber-50 border-amber-400 text-amber-800'
                                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                              }`}>
                              <input type="radio" name="students_range" required={i === 0} value={range}
                                checked={studentRange === range} onChange={() => setStudentRange(range)} className="sr-only" />
                              <span>{range}</span>
                              {studentRange === range && <Check className="w-3 h-3 ml-1.5 shrink-0" />}
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Erreur d'enregistrement (réseau / feuille injoignable) */}
                      {sendError && (
                        <div className="flex items-start space-x-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs leading-relaxed">
                          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>{sendError}</span>
                        </div>
                      )}

                      <button type="submit" disabled={sending}
                        className="w-full py-4 bg-slate-900 hover:bg-slate-700 disabled:opacity-60 disabled:cursor-wait text-white font-bold rounded-xl transition-colors text-sm flex items-center justify-center space-x-2 shadow-lg shadow-slate-900/20">
                        {sending ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Enregistrement en cours…</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Sécuriser mon siège Fondateur — Gratuit</span>
                          </>
                        )}
                      </button>

                      <p className="text-xs text-center text-slate-400 leading-relaxed">
                        Aucun engagement financier. Nous vous contactons sur WhatsApp sous 48h. Vos données restent confidentielles.
                      </p>

                      {/* Repère de configuration : visible tant que l'URL Apps Script est absente */}
                      {!SHEET_ENABLED && (
                        <p className="text-[10px] text-center font-mono text-amber-600/70 leading-relaxed">
                          mode démo — VITE_APPS_SCRIPT_URL non configurée : aucune donnée n'est envoyée
                        </p>
                      )}
                    </form>
                  </div>
                ) : (
                  <div className="text-center space-y-6 py-8">
                    <div className="w-16 h-16 bg-emerald-100 border-2 border-emerald-200 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Candidature enregistrée !</h3>
                      <p className="text-slate-500">Bienvenue dans le Programme Fondateurs SchoolOS, <strong className="text-slate-800">{name}</strong>.</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left max-w-md mx-auto">
                      <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-4 text-center">Confirmation — Fondateur #{founderRef}</div>
                      <div className="space-y-2.5 text-sm">
                        {[
                          { label: 'Établissement', val: schoolName },
                          { label: 'Élèves (approx.)', val: studentRange },
                          { label: 'Responsable', val: name },
                          { label: 'Contact WhatsApp', val: whatsapp },
                          { label: 'Statut', val: `Fondateur #FNDR-${founderRef}`, highlight: true },
                        ].map((row, i) => (
                          <div key={i} className="flex justify-between items-center border-b border-slate-100 pb-2 last:border-0">
                            <span className="text-slate-500">{row.label}</span>
                            <span className={row.highlight ? 'text-emerald-700 font-bold' : 'font-semibold text-slate-800'}>{row.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 max-w-md mx-auto">
                      <strong>Prochaine étape :</strong> Notre équipe vous contacte sur WhatsApp sous <strong>48h</strong> pour planifier votre appel de qualification.
                    </div>
                    <button onClick={() => setSubmitted(false)} className="text-sm text-slate-400 underline">Inscrire un autre établissement</button>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Key message */}
          <div className="mt-10 pt-5 border-t border-slate-100">
            <p className="text-sm text-slate-400">
              <span className="font-semibold text-slate-500">À retenir : </span>
              {SLIDES_DATA[slide].keyMessage}
            </p>
          </div>
        </div>
      </main>

      {/* ─── BOTTOM NAV ─── */}
      <nav className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-slate-100 px-5 md:px-10 py-3 flex items-center justify-between gap-4">
        <button onClick={goPrev} disabled={slide === 0}
          className="flex items-center space-x-1.5 text-sm text-slate-500 hover:text-slate-900 disabled:opacity-25 disabled:pointer-events-none transition-colors">
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Précédent</span>
        </button>

        <div className="flex items-center flex-1 justify-center">
          {/* Mobile: text indicator */}
          <span className="sm:hidden text-xs font-mono text-slate-500">{slide + 1} / {total}</span>
          {/* Desktop: dots */}
          <div className="hidden sm:flex items-center space-x-1.5">
            {SLIDES_DATA.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)}
                className={`rounded-full transition-all cursor-pointer ${i === slide ? 'w-5 h-2 bg-slate-900' : 'w-2 h-2 bg-slate-200 hover:bg-slate-400'}`} />
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="hidden sm:block text-xs text-slate-400 font-mono">{slide + 1}/{total}</span>
          <button onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${isPlaying ? 'border-amber-300 bg-amber-50 text-amber-600' : 'border-slate-200 text-slate-400 hover:text-slate-600'}`}>
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button onClick={goNext} disabled={slide === total - 1}
            className="flex items-center space-x-1.5 text-sm bg-slate-900 hover:bg-slate-700 text-white font-semibold px-4 py-2 rounded-lg disabled:opacity-25 disabled:pointer-events-none transition-colors">
            <span className="hidden sm:inline">Suivant</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </nav>
    </div>
  );
}
