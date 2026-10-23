# MR-Hausservice – Version 1.9.8.6

Private PWA für **Hausservice**, **Familie & Privat** und den integrierten Bereich **Frauen-Gesundheit**.

## Änderungen
- Sichtbare Versionsnummer auf Startseite und im Profil.
- Versionsabgleich von `js/core.js`, `version.json`, Manifest und Service Worker.
- Zehn Familienkachel-Bilder unter `family_assets/` (für mobile Anzeige optimiert) und Offline-Cache.
- Alte Versionsanleitungen und doppelte Bildkopien aus dem aktiven Repository entfernt; Git-Verlauf bleibt erhalten.

## Datensicherung
Die Daten werden lokal im Browser/IndexedDB gespeichert. Google Drive ermöglicht manuelle Sicherung, keinen Live-Sync. Vor einem Update **Gesamtsicherung** exportieren und die Website-Daten nicht löschen. Der Frauen-Gesundheitsbereich besitzt kein separates App-Passwort; Sicherungsdateien vertraulich behandeln.

## Teststand
Syntax-/Dateiverweise geprüft; GitHub-Pages-Deployment und Funktionstest auf Android getrennt kontrollieren.
