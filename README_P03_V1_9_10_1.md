# M.R Hauservice 1.9.10.1 — Update P03: Professionelle Reinigungsdurchführung

Basis: vollständiges Archiv 1.9.10.0 / GitHub-Stand vom 24.10.2026. Bestehender privater Speicher `db.personal.household`, Backup/Google Drive, Frauen-Gesundheit, Finanzbelege, Gewerbe sowie P01/P02 bleiben im Archiv. Keine destruktive Datenmigration.

## Funktionsumfang

- **P03-F01:** Bearbeitbare Schritt-Checklisten je Putzaufgabe, inklusive Hinweis pro Schritt. Beim Start wird ein Snapshot pro gewähltem Raum/Zone erstellt; Schritte bleiben nach App-Neustart gespeichert. Alte Aufgaben ohne Schritte werden als Einzelschritt abgebildet. Spontanreinigungen bleiben möglich.
- **P03-F02:** Soll-Zeit je Aufgabe, Ist-Zeit je Raum und Reinigung, Pause/Weiter, Zeitkorrekturen ausschließlich mit Begründung samt Zeitstempel und vorher/nachher. Mehrtägige Pausen werden separat erfasst, Arbeitszeit summiert sich nur während laufender Phasen. Werte in `h min` in Bericht/Statistik.
- **P03-F03:** Fortschritt je Schritt, Aufgabe, Zone, Raum und Reinigung, inklusive Rücknahme; vollständig erledigte Aufgaben steuern die bestehende P02-Intervallrechnung.
- **P03-F04:** Mehrere Vorher-/Nachher-Fotos, Beschreibung, Raum-/Zonenzuordnung, Zoom, Vergleichsansicht und vollständige Metadatenspeicherung im vorhandenen Backup-Datenmodell. Bestehende alte Fotoarrays bleiben verwendbar.
- **P03-F05:** Qualitäts- und Abschlusskontrolle vor Lagerabzug. Prüfpflichten: mindestens ein Schritt, Arbeitszeit, Ergebnis; bei Teilabschluss Begründung. Materialabzug erfolgt erst nach bestätigtem Abschluss. Nachkontrolle und Korrekturen werden in abgeschlossener Sitzung protokolliert.

## Technische Dateien

- `js/p03_cleaning.js`: testbarer reiner Berechnungs- und Validierungskern
- `js/private1980.js`: Erweiterung bestehender privater UI- und Speicheraktionen
- `p03_cleaning.css`: responsives dunkles Premium-Design
- `tests/p03_cleaning.test.cjs`: 19 automatisierte P03-Tests
- `index.html`, `js/core.js`, `sw.js`, `manifest.webmanifest`, `version.json`: Versions- und Asset-Updates

## Prüfstand

Automatisierte Node-Tests (`node --test tests/p03_cleaning.test.cjs`): **19 bestanden**. Regeneration von Aufgaben-/Raum-Snapshots, Stufenprozente, Rücknahmen, Zeitkorrekturen, Pausen über Kalendertage, Pflichtkontrollen, Foto-Metadaten, Legacy-Daten und Privat/Gewerbe-Trennung geprüft.

Syntaxprüfung aller JavaScript-Dateien im Release sowie ZIP-Integritätsprüfung durchgeführt. Der Chromium-/Playwright-Test im Ausführungscontainer ist durch `ERR_BLOCKED_BY_ADMINISTRATOR` für lokale URLs blockiert; kein vollständiger UI-/Endgerätenachweis. **Android, Windows, Backup/Restore mit realen Fotos, PDF und Bedienabläufe müssen auf den Endgeräten getestet werden.** Daher bleiben die Funktionsabnahmehäkchen bis dahin offen.

## Nutzung

1. Vorher manuelles JSON-/Drive-Backup anlegen.
2. Familie & Privat → Haushalt & Putzen → Putzpläne → neue Aufgabe anlegen bzw. öffnen und Reinigungsablauf + Sollzeit pflegen.
3. Reinigung starten → Schritte abhaken, bei Bedarf Pause/Weiter und Zeit korrigieren.
4. Vorher-/Nachher-Fotos aufnehmen, nach Bedarf zuordnen und vergleichen.
5. Nachkontrolle ausfüllen. „Geprüft abschließen“ zieht Material ab und schreibt den Abschlussbericht.

Version: 1.9.10.1 · P03 · Stand 24.10.2026
