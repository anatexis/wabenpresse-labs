# Wabenpresse Labs

Lokale Zero-to-One-Demo fuer ein Startup, das urbane Bienenhaltung, mobile Saftpressen und eine operative Management-Oberflaeche verbindet.

## Start

```bash
npm start
```

Dann `http://localhost:4173` im Browser oeffnen.

## Was enthalten ist

- Landingpage mit Startup-Konzept, Positionierung und 180-Tage-Plan
- Produktangebote und ein konfigurierbarer Press-Tag
- Organisationsfunktionen mit OKRs, Routenplanung, Kanban, Finance-Modell und Founder-Notizen
- Demo-Checkout mit lokaler Bestellspeicherung in `localStorage`

## Produktionsnahe Weiterentwicklung

- Zahlungsstub in [`app.js`](/home/christoph/Dokumente/Baumhaus/Programmieren/RUDL/app.js) gegen Stripe oder Adyen austauschen
- Datenhaltung von `localStorage` in echtes Backend migrieren
- Authentifizierung fuer interne Ops-Rollen und externe Kunden trennen
