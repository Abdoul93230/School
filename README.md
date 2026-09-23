<div align="center">
  <img width="120" height="120" alt="SchoolOS" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%230f172a'/%3E%3Ctext x='32' y='44' font-family='Inter, Arial, sans-serif' font-size='34' font-weight='700' fill='%23fbbf24' text-anchor='middle'%3ES%3C/text%3E%3C/svg%3E" />
</div>

# SchoolOS — Programme Pionnier

Présentation stratégique B2B et simulateur d'impact pour les futurs **Établissements Fondateurs SchoolOS**.

SchoolOS est la première plateforme intelligente de gestion scolaire conçue pour les établissements privés d'Afrique francophone. Développée par **SmartLimb** (Niamey, Niger).

## Fonctionnalités

- 🖥️ **Landing page** — site vitrine avec simulateur d'impact et formulaire de candidature
- 📊 **Présentation interactive** — deck commercial de 12 slides avec démonstrations en direct
- ✉️ **Générateur de lettres** — lettres de prospection imprimables au format A4

## Démarrage

**Prérequis :** Node.js

1. Installer les dépendances :
   `npm install`
2. Lancer en mode développement :
   `npm run dev`
3. Construire pour la production :
   `npm run build`

## Candidatures → Google Sheets (Apps Script)

Chaque candidature envoyée depuis la landing page ou la présentation est enregistrée
dans une feuille Google Sheets, via un Web App **Google Apps Script**.

**Mise en place (≈ 5 minutes) :**

1. Créez une feuille vierge : <https://sheets.new> → nommez-la « SchoolOS — Candidatures Fondateurs 2026 ».
2. Dans la feuille : **Extensions → Apps Script**.
3. Supprimez le code d'exemple et collez le contenu de **`google-apps-script.js`** (racine du projet).
4. Exécutez la fonction **`setup`** une fois (▶ Exécuter) et autorisez les permissions.
5. **Déployer → Nouveau déploiement → Application Web**
   * Exécuter en tant que : **Moi**
   * Qui a accès : **Tout le monde**
   → copiez l'URL terminée par **`/exec`**.
6. Collez-la dans **`.env.local`** :
   `VITE_APPS_SCRIPT_URL="https://script.google.com/macros/s/AKfy…/exec"`
7. Relancez `npm run dev` (ou `npm run build`).

Colonnes enregistrées : `# · Date · Heure · Nom du responsable · Établissement ·
Élèves (approx.) · WhatsApp · Email · Pays · Source · Statut`.

> Sans URL configurée, l'application fonctionne en **mode démo** : le formulaire
> s'affiche normalement, affiche « mode démo » sous le bouton, mais aucune donnée
> n'est envoyée ni stockée.

---

© 2026 SmartLimb — schoolos.africa
