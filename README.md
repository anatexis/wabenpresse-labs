# Wabenpresse Labs

Lokale Zero-to-One-Demo fuer ein Startup, das urbane Bienenhaltung, mobile Saftpressen und eine operative Management-Oberflaeche verbindet.

## Seitenstruktur

- `index.html`: oeffentliche Kundenseite mit Angebot, Pilot-Konfigurator und Demo-Checkout
- `startup.html`: interner Startup-Bereich mit OKRs, Routen, Kanban, Finance und Order-Log

## Passwort fuer den Startup-Bereich

- Standardpasswort: `waben2026`
- Das Passwort wird nur clientseitig geprueft und ist fuer GitHub Pages organisatorisch nuetzlich, aber nicht wirklich sicher.
- Fuer echte Sicherheit spaeter Backend-Auth oder einen vorgeschalteten Access-Layer nutzen.

## Start lokal

```bash
npm start
```

Dann `http://localhost:4173` im Browser oeffnen.

## Deployment auf GitHub Pages

- Das Projekt ist statisch und kann direkt aus dem Repo-Root auf GitHub Pages ausgeliefert werden.
- Nach einem Push auf den konfigurierten Branch aktualisiert GitHub Pages `index.html` und macht `startup.html` als zweite Seite verfuegbar.
- Der lokale `server.mjs` ist nur fuer die lokale Vorschau gedacht und wird auf GitHub Pages nicht benoetigt.

## Was enthalten ist

- Landingpage mit Startup-Konzept, Positionierung und 180-Tage-Plan
- Produktangebote und ein konfigurierbarer Press-Tag
- Getrennte Kundenseite und Founder-Seite
- Organisationsfunktionen mit OKRs, Routenplanung, Kanban, Finance-Modell und Founder-Notizen
- Demo-Checkout mit lokaler Bestellspeicherung in `localStorage`

## Produktionsnahe Weiterentwicklung

- Passwort-Stub in `app.js` durch echte Authentifizierung ersetzen
- Zahlungsstub in `app.js` gegen Stripe oder Adyen austauschen
- Datenhaltung von `localStorage` in echtes Backend migrieren
