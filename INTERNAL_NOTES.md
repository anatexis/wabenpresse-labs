# Internal Notes

Dieses Dokument ist fuer spaetere Weiterarbeit an `wabenpresse-labs`.

## Projektstruktur

- `index.html`: oeffentliche Kundenseite
- `startup.html`: interner Founder-Bereich
- `app.js`: gemeinsame Client-Logik fuer beide Seiten
- `styles.css`: gemeinsames Designsystem
- `server.mjs`: nur fuer lokales statisches Testen, nicht fuer GitHub Pages

## Aktueller Produktzuschnitt

- Kundenseite mit Angebot, Konfigurator und Demo-Checkout
- Founder-Seite mit Passwort-Gate, OKRs, Routen, Kanban, Finance und Order-Log
- Persistenz ueber `localStorage`

## Passwort und Sicherheit

- Standardpasswort in `app.js`: `waben2026`
- Das ist nur ein clientseitiges Gate und keine echte Sicherheit
- Fuer Produktion ersetzen durch:
  - Backend-Auth
  - oder vorgeschalteten Access-Layer wie Cloudflare Access

## Hosting

- Zielplattform: GitHub Pages
- Wichtige Dateien fuer Pages:
  - `index.html`
  - `startup.html`
  - `.nojekyll`
- `server.mjs` wird auf GitHub Pages nicht genutzt

## Offene naechste Schritte

- Passwort vor Veroeffentlichung aendern
- Optional `CNAME` fuer eine Custom Domain anlegen
- Demo-Payment spaeter gegen Stripe oder Adyen austauschen
- Wenn echte interne Daten entstehen: Founder-Seite aus statischem Hosting herausloesen

## Hinweis fuer spaetere Bearbeitung

- Kunde und Founder teilen sich aktuell denselben `localStorage`-State
- Bestellungen von der Kundenseite erscheinen im Startup-Bereich
- Bei spaeterem Backend-Split zuerst Datenmodell fuer Orders, Tasks, Routes und Finance trennen
