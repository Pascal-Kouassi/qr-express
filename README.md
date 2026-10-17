# QR Express — Générateur de QR codes

Site 100 % frontend (HTML, CSS, JavaScript), sans backend ni base de données.

## Lancer le projet
Ouvrez `index.html` dans le navigateur (ou « Open with Live Server » dans VS Code).
Aucune connexion Internet n'est nécessaire : la bibliothèque QR est incluse (`js/qrcode.js`).

## Structure
- `index.html` — génération, aperçu, téléchargement PNG, effacement
- `historique.html` — liste, retrouver, télécharger, supprimer
- `css/style.css` — design bleu foncé / blanc / bleu clair, responsive
- `js/qrcode.js` — bibliothèque QR (Kazuhiko Arase, MIT)
- `js/utils.js` — dessin du QR, téléchargement, localStorage
- `js/app.js` — logique de la page d'accueil
- `js/historique.js` — logique de la page historique

## Évolutions possibles
Couleurs personnalisées, logo au centre, QR code de coordonnées de contact (vCard).
