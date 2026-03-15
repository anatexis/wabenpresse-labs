# Wabenpresse Labs

Lokale Demo für ein Projekt, das urbane Bienenhaltung, mobile Saftpressen und eine operative Management-Oberfläche verbindet.

## Seitenstruktur

- `index.html`: öffentliche Kundenseite mit Angebot, Pilot-Konfigurator und Demo-Buchung
- `startup.html`: interner Bereich mit OKRs, Routen, Kanban, Finanzen und Auftragslog

## Passwort für den internen Bereich

- Standardpasswort: `waben2026`
- Das Passwort wird nur clientseitig geprüft und ist für GitHub Pages organisatorisch nützlich, aber nicht wirklich sicher.
- Für echte Sicherheit später Backend-Authentifizierung oder einen vorgeschalteten Zugriffsschutz nutzen.

## Start lokal

```bash
npm start
```

Dann `http://localhost:4173` im Browser öffnen.

## Deployment auf GitHub Pages

- Das Projekt ist statisch und kann direkt aus dem Repo-Root auf GitHub Pages ausgeliefert werden.
- Nach einem Push auf den konfigurierten Branch aktualisiert GitHub Pages `index.html` und macht `startup.html` als zweite Seite verfügbar.
- Der lokale `server.mjs` ist nur für die lokale Vorschau gedacht und wird auf GitHub Pages nicht benötigt.

## Was enthalten ist

- Landingpage mit Kundenangebot, Positionierung und Leistungsübersicht
- Produktangebote und ein konfigurierbarer Press-Tag
- Getrennte Kundenseite und interner Bereich
- Organisationsfunktionen mit OKRs, Routenplanung, Kanban, Finanzmodell und internen Notizen
- Demo-Buchung mit lokaler Speicherung in `localStorage`

## Produktionsnahe Weiterentwicklung

- Passwort-Stub in `app.js` durch echte Authentifizierung ersetzen
- Zahlungsstub in `app.js` gegen Stripe oder Adyen austauschen
- Datenhaltung von `localStorage` in echtes Backend migrieren
