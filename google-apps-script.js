/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  SchoolOS — Candidatures Fondateurs → Google Sheets
 *  SmartLimb · Niamey, Niger
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  INSTALLATION (≈ 3 minutes, AUCUN ID à copier)
 *
 *  1. Ouvrez https://script.google.com/home → « Nouveau projet »
 *     (ou, si vous préférez partir d'une feuille : créez-la sur https://sheets.new
 *      puis Extensions → Apps Script — le résultat est identique).
 *
 *  2. Supprimez le code d'exemple (function myFunction() { ... }) et collez
 *     CE FICHIER en entier. Enregistrez (Ctrl+S) et nommez le projet
 *     « SchoolOS — Candidatures ».
 *
 *  3. Exécutez la fonction `setup` UNE FOIS :
 *     menu déroulant des fonctions → setup → ▶ Exécuter.
 *     Autorisez les permissions demandées (votre propre compte Google).
 *     → Une feuille « SchoolOS — Candidatures Fondateurs 2026 » est créée
 *       automatiquement si besoin, avec l'onglet « Candidatures » prêt.
 *       Son URL s'affiche dans le journal d'exécution (📋 Journal de la course).
 *
 *  4. Déployez le Web App : bouton « Déployer » → « Nouveau déploiement »
 *       - Type de déploiement ……… Application Web
 *       - Description ……………… SchoolOS Candidatures v1
 *       - Exécuter en tant que … Moi (votre compte)
 *       - Qui a accès …………… Tout le monde
 *     → Déployer → Autoriser → **copiez l'URL qui se termine par /exec**
 *
 *  5. Collez cette URL dans le fichier `.env.local` du projet React :
 *       VITE_APPS_SCRIPT_URL="https://script.google.com/macros/s/AKfy…/exec"
 *     puis relancez `npm run dev` (ou `npm run build` pour la production).
 *
 *  ⚠️  Après TOUTE modification de ce script, republiez :
 *      Déployer → Gérer les déploiements → ✏️ Modifier → Version : « Nouvelle version »
 *      → Déployer. Sinon l'URL /exec continue de servir l'ancienne version.
 *
 *  📌 Le site n'envoie jamais de données au nom des visiteurs : les
 *     candidatures sont écrites avec VOTRE compte, dans VOTRE feuille.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** Nom de l'onglet qui reçoit les candidatures */
const SHEET_NAME = 'Candidatures';

/** Nombre total de places du Programme Fondateur — à garder aligné avec PLACES_TOTAL du site */
const TOTAL_PLACES = 20;

/** Adresse prévenue à chaque nouvelle candidature — laisser '' pour désactiver */
const NOTIFY_EMAIL = '';

/** Fuseau horaire utilisé pour dater les candidatures (Niamey = UTC+1, sans heure d'été) */
const TIMEZONE = 'Africa/Niamey';

/**
 * ⚙️ Laissez '' : le script gère la feuille TOUT SEUL.
 *  - Projet créé depuis la feuille (Extensions → Apps Script) → il utilise cette feuille.
 *  - Projet autonome (script.google.com) → il CRÉE automatiquement une feuille
 *    « SchoolOS — Candidatures Fondateurs 2026 » au premier `setup()` et s'en
 *    souvient. Son URL est affichée dans le journal d'exécution.
 * Vous n'avez donc jamais besoin de renseigner un ID ici.
 */
const SPREADSHEET_ID = '';

/** En-têtes du tableau, dans l'ordre des colonnes */
const HEADERS = [
  '#', 'Date', 'Heure', 'Nom du responsable', 'Établissement',
  'Élèves (approx.)', 'WhatsApp', 'Email', 'Pays', 'Source', 'Statut',
];

/** Statut attribué automatiquement à toute nouvelle candidature */
const DEFAULT_STATUS = 'Nouveau';

/** Couleur de l'en-tête (ambre SchoolOS) */
const HEADER_BG = '#f59e0b';

/** Largeurs des colonnes, dans l'ordre */
const COLUMN_WIDTHS = [40, 90, 60, 180, 220, 120, 150, 200, 90, 100, 100];

// ─────────────────────────────────────────────────────────────────────────────
//  Outils internes
// ─────────────────────────────────────────────────────────────────────────────

/** Réponse JSON renvoyée au site (ContentService ajoute l'en-tête CORS) */
function buildResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Nettoie une valeur reçue du formulaire */
function clean(value) {
  return (value === undefined || value === null) ? '' : String(value).trim();
}

/** Ne conserve que les chiffres d'un numéro (pour détecter les doublons) */
function digitsOnly(value) {
  return clean(value).replace(/\D/g, '');
}

/**
 * Renvoie la feuille de calcul cible, dans tous les cas de figure :
 *  1. SPREADSHEET_ID renseigné manuellement → openById()
 *  2. Projet lié à une feuille (Extensions → Apps Script) → getActiveSpreadsheet()
 *  3. Projet autonome → la feuille créée automatiquement (id mémorisé),
 *     ou création à la volée si c'est le premier appel.
 */
function getSpreadsheet() {
  // 1. ID fixé manuellement dans la configuration
  if (SPREADSHEET_ID) {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    if (!ss) throw new Error('SPREADSHEET_ID invalide : feuille introuvable.');
    return ss;
  }

  // 2. Projet lié à une feuille
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;

  // 3. Projet autonome : feuille déjà créée lors d'un appel précédent ?
  const props = PropertiesService.getScriptProperties();
  const storedId = props.getProperty('SHEET_ID');
  if (storedId) {
    const ss = SpreadsheetApp.openById(storedId);
    if (ss) return ss;
  }

  // Première exécution : on crée la feuille et on mémorise son ID
  const created = SpreadsheetApp.create('SchoolOS — Candidatures Fondateurs 2026');
  props.setProperty('SHEET_ID', created.getId());
  console.log('Feuille créée automatiquement : ' + created.getUrl());
  return created;
}

/**
 * Renvoie l'onglet des candidatures, en le créant et en l'habillant au besoin.
 * Les en-têtes ne sont écrits que si la feuille est vide : aucune donnée
 * existante n'est jamais déplacée.
 */
function getSheet() {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    styleSheet(sheet);
  }
  return sheet;
}

/** Écrit les en-têtes et applique la mise en forme (feuille vide uniquement) */
function styleSheet(sheet) {
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.getRange(1, 1, 1, HEADERS.length)
    .setFontWeight('bold')
    .setFontColor('#1f2937')
    .setBackground(HEADER_BG)
    .setVerticalAlignment('middle');
  sheet.setRowHeight(1, 34);
  sheet.setFrozenRows(1);
  sheet.setColumnWidths(1, HEADERS.length, COLUMN_WIDTHS);

  // Colonne WhatsApp (G) en texte brut : un numéro « +227 … » ne doit jamais
  // être interprété comme une formule (sinon affichage « ERROR! »)
  sheet.getRange(2, 7, sheet.getMaxRows() - 1, 1).setNumberFormat('@');

  // Lignes alternées lisibles
  for (let row = 2; row <= 200; row++) {
    if (row % 2 === 0) sheet.getRange(row, 1, 1, HEADERS.length).setBackground('#fffaf0');
  }
}

/** Retrouve une candidature déjà enregistrée (même WhatsApp + même établissement) */
function findExisting(sheet, whatsapp, school) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;

  const from = Math.max(2, lastRow - 300); // on ne scrute que les 300 dernières lignes
  const rows = sheet.getRange(from, 1, lastRow - from + 1, HEADERS.length).getValues();
  const key = digitsOnly(whatsapp).slice(-8); // les 8 derniers chiffres suffisent
  const schoolKey = clean(school).toLowerCase();

  for (let i = rows.length - 1; i >= 0; i--) {
    const rowWhatsapp = digitsOnly(rows[i][6]).slice(-8);
    const rowSchool = clean(rows[i][4]).toLowerCase();
    if (key && rowWhatsapp === key && rowSchool === schoolKey) {
      return Number(rows[i][0]) || 0;
    }
  }
  return 0;
}

/** Prévient l'équipe SmartLimb par email (si NOTIFY_EMAIL est renseigné) */
function notifyTeam(number, data) {
  if (!NOTIFY_EMAIL) return;
  try {
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: 'SchoolOS — Nouvelle candidature Fondateur #' + number + ' : ' + data.school,
      body: [
        'Nouvelle candidature reçue sur le site SchoolOS (source : ' + (data.source || 'site') + ').',
        '',
        'Numéro de Fondateur : #' + number,
        'Établissement ...... : ' + data.school,
        'Responsable ........ : ' + data.name,
        'Élèves (approx.) ... : ' + (data.students || 'non précisé'),
        'WhatsApp ........... : ' + data.whatsapp,
        'Email .............. : ' + (data.email || 'non précisé'),
        'Pays ............... : ' + (data.country || 'non précisé'),
        '',
        'Places restantes : ' + Math.max(TOTAL_PLACES - number, 0) + ' sur ' + TOTAL_PLACES,
        '',
        'Feuille de suivi : ' + getSpreadsheet().getUrl(),
      ].join('\n'),
    });
  } catch (err) {
    // Un échec d'email ne doit jamais faire échouer l'enregistrement
    console.error('Notification email impossible : ' + err);
  }
}


// ─────────────────────────────────────────────────────────────────────────────
//  Installation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * À exécuter une seule fois après avoir collé ce code (menu ▶ Exécuter).
 * Crée l'onglet « Candidatures » avec ses en-têtes et sa mise en forme.
 */
function setup() {
  const sheet = getSheet();
  if (sheet.getLastRow() === 0) styleSheet(sheet);

  getSpreadsheet().toast(
    'Onglet « ' + SHEET_NAME + ' » prêt. Déployez maintenant le Web App.',
    'SchoolOS — installation terminée',
    8
  );

  console.log('OK — déployez : Déployer → Nouveau déploiement → Application Web');
  return 'OK';
}

// ─────────────────────────────────────────────────────────────────────────────
//  API du Web App
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST — enregistre une candidature envoyée par le formulaire du site.
 * Corps attendu (JSON) :
 *   { name, school, whatsapp, email?, students?, country?, source? }
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return buildResponse({ success: false, error: 'Aucune donnée reçue.' });
    }

    const body = JSON.parse(e.postData.contents);

    const data = {
      name: clean(body.name),
      school: clean(body.school),
      whatsapp: clean(body.whatsapp),
      email: clean(body.email),
      students: clean(body.students),
      country: clean(body.country) || 'Niger',
      source: clean(body.source) || 'site',
    };

    // Champs obligatoires
    if (!data.name || !data.school || !data.whatsapp) {
      return buildResponse({
        success: false,
        error: 'Champs requis manquants : nom, établissement et WhatsApp sont obligatoires.',
      });
    }

    const sheet = getSheet();

    // Anti-doublon (double clic sur le bouton d'envoi)
    const existing = findExisting(sheet, data.whatsapp, data.school);
    if (existing > 0) {
      return buildResponse({ success: true, number: existing, duplicate: true });
    }

    const number = Math.max(sheet.getLastRow() - 1, 0) + 1;

    const now = new Date();
    const date = Utilities.formatDate(now, TIMEZONE, 'dd/MM/yyyy');
    const time = Utilities.formatDate(now, TIMEZONE, 'HH:mm');

    sheet.appendRow([
      number, date, time, data.name, data.school,
      data.students, data.whatsapp, data.email, data.country, data.source, DEFAULT_STATUS,
    ]);

    const row = sheet.getLastRow();
    if (row % 2 === 0) {
      sheet.getRange(row, 1, 1, HEADERS.length).setBackground('#fffaf0');
    }

    // Réécrit le WhatsApp en texte brut : au moment du appendRow, Sheets
    // interprète le « + » initial comme une formule (cellule « ERROR! »)
    const waCell = sheet.getRange(row, 7, 1, 1);
    waCell.setNumberFormat('@');
    waCell.setValue(data.whatsapp);

    notifyTeam(number, data);

    return buildResponse({
      success: true,
      number: number,
      duplicate: false,
      placesLeft: Math.max(TOTAL_PLACES - number, 0),
    });

  } catch (err) {
    return buildResponse({ success: false, error: String(err) });
  }
}

/**
 * GET — renvoie le nombre de candidatures déjà enregistrées.
 * Utilisé par le site pour afficher les places réellement restantes.
 */
function doGet() {
  try {
    const sheet = getSpreadsheet().getSheetByName(SHEET_NAME);
    const hasHeader = !!sheet && sheet.getLastRow() > 0 && sheet.getRange(1, 1).getValue() === '#';
    const count = sheet ? Math.max(sheet.getLastRow() - (hasHeader ? 1 : 0), 0) : 0;

    return buildResponse({
      success: true,
      count: count,
      placesLeft: Math.max(TOTAL_PLACES - count, 0),
      total: TOTAL_PLACES,
    });
  } catch (err) {
    return buildResponse({ success: false, count: 0, error: String(err) });
  }
}

