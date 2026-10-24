# M.R Hauservice V1.9.10.0 – P02: Intelligente Putzpläne und Erinnerungen

Stand: 24.10.2026. Basis: GitHub-Release V1.9.9.9, Commit `6f8c1cf20f7043d5ad1ab36de927953f1424d255`.

## Fünf umgesetzte Funktionen

- **P02-F01:** Täglich, alle X Tage, X Wochen, X Monate, bestimmte Wochentage und ausgewählte Saisonmonate. Fester Kalender-Rhythmus oder Neuberechnung nach tatsächlich abgeschlossenem Putzen. Kalenderarithmetik einschließlich Monatsende und Schaltjahr.
- **P02-F02:** Kalenderprojektion der privaten Putzpläne direkt in bestehende Tages-, Wochen- und Monatsansicht. Öffnen per Pfeil zur Aufgabe. Keine zusätzlichen oder doppelten Datensätze in `db.appointments`.
- **P02-F03:** Einzeltermin verschieben, mit Begründung auslassen oder einen ausgelassenen Termin nachholen. Originaltermin, Datum, Grund und Zeitpunkt werden im Aufgabenverlauf gespeichert; Folgeaufgaben nach gewähltem Regelmodus.
- **P02-F04:** Überfällige und dringende Aufgaben im privaten Dashboard und im Putzplan hervorgehoben. In-App-Hinweise, **keine** versprochenen Hintergrund-Pushmeldungen.
- **P02-F05:** Offline-Intervallvorschläge anhand von mindestens 3 unterschiedlichen dokumentierten Reinigungstagen, transparent mit Datengrundlage; Plan wird nur nach Bestätigung angepasst.

## Daten- und Update-Schutz

Vorhandene P01-Raumprofile, Räume, Zonen, Handzeichnungen, Berichte und Fotos bleiben erhalten. Kein Löschen und keine Datenmigration. Neue Optionen werden nur im bestehenden privaten Bereich `db.personal.household.tasks` gespeichert. Gewerbliche Aufträge und Finanzen bleiben unberührt. Lokale Daten werden beim Update **nicht** automatisch auf ein anderes Gerät übertragen; vor dem ersten Start externe Datensicherung durchführen.

## Prüfung

- JavaScript-Syntaxprüfung: Kernmodul, privater Haushaltscode, Kalender, Service Worker bestanden.
- 19 Datums-/Intervall-Unit-Tests in `tests/p02_schedule.test.cjs` bestanden.
- 7 zusätzliche Integrationsprüfungen (Aktionen, Daten- und Historienfortführung) in `tests/p02_actions.test.cjs` bestanden.
- ZIP-Vollständigkeit und Archivkonsistenz geprüft.
- Browser-End-to-End-Test wurde aufgrund `ERR_BLOCKED_BY_ADMINISTRATOR` nicht durchgeführt. Android-, Windows- und echte Datenwiederherstellung bleiben **offen**. Deshalb bleibt die Abnahme in der Word-Mastercheckliste **offen**.

## Bedienung

1. Unter **Familie & Privat → Haushalt & Putzen → Putzpläne** einen Plan erstellen oder bearbeiten.
2. Intervall, ggf. Wochentage / Saisonmonate, Fix-Rhythmus oder nach Erledigung auswählen.
3. In der Putzplan-Liste einen einzelnen Termin verschieben oder auslassen. Im aufklappbaren Abschnitt **Ausgelassene Termine** kann er nachgeholt werden.
4. Kalender öffnen, den gewünschten Tag wählen und über den Pfeil am Putzplan direkt in die Bearbeitung wechseln.
5. Nach mindestens drei dokumentierten Reinigungstagen wird bei ausreichenden Daten eine nachvollziehbare Intervall-Empfehlung angeboten.

## Bekannte Grenzen

- In-App-Fälligkeitshinweise werden beim Öffnen/Benutzen aktualisiert; kein garantierter Alarm bei geschlossener App.
- Browser-Cache/PWA: Nach Veröffentlichung Version in der App kontrollieren, bei Bedarf Seite aktualisieren.
- Geräteabnahme von Fotos, Belegen, Google-Drive-Backup und PDF-Funktionen erfolgt gesondert mit echtem Bestand.
