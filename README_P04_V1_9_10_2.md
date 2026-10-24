# M.R Hauservice – Update V1.9.10.2 (P04)

**Ausgangsbasis:** V1.9.10.1 (P03), ZIP vom 24.10.2026. Alle vorhandenen Module, Datenstrukturen und Backuprouten bleiben erhalten. Vor dem ersten Test bitte eine vollständige externe JSON-Sicherung anlegen.

## P04 – Intelligente Material- und Lagerverwaltung

- **P04-F01 Hauptlagerverknüpfung:** Der Reinigungsbereich zeigt dieselben `db.stock`-Artikel/Lagerorte wie „Mein Lager“. Es werden keine automatischen Artikelkopien erstellt. Ältere `personal.household.supplies` bleiben als Altbestand vorhanden und funktionsfähig.
- **P04-F02 Privat-/Gewerbetrennung:** Artikel gehören anhand `l2home` / `scope` eindeutig zu einer Bestandsseite. `l2shared` ändert diese Zuordnung nicht. Nur bewusst bestätigte Umlagerungen ändern Bestandsmengen beider Bereiche und werden protokolliert.
- **P04-F03 Materialbuchungslog:** Beim Reinigungsabschluss werden Verbräuche nach Bestätigung in derselben Datensicherung von Reinigung und Lager abgezogen. Buchungen können unter Material mit Begründung korrigiert oder rückgängig gemacht werden. Das Protokoll wird fortgeschrieben, nicht überschrieben. Bei fehlgeschlagenem Speicherzugriff werden die Änderungen im Speicher zurückgesetzt.
- **P04-F04 Einheiten und Kosten:** Stück/Paar bleiben separate Zähleinheiten; Liter/ml und kg/g werden exakt mit festen Umrechnungsfaktoren normalisiert. Der Artikelpreis wird je gespeicherter Einheit verwaltet. Materialwerte sind **keine** neuen Ausgaben in den Finanzen. Verbrauch kann je Raum zugeordnet werden; Berichte enthalten je Raum und Reinigung die Kosten.
- **P04-F05 Mindestbestand und Nachkauf:** Mindestmengen im Hauptlager pro Artikel, aggregierte Bestände über Lagerorte, eine kopierbare Nachkaufliste. Barcode- und QR-Suche ist manuell nutzbar; Kamerascannen wird nur auf Browsern/Geräten angeboten, die `BarcodeDetector` und Kamera-Zugriff zur Laufzeit unterstützen. Endgerätetest steht noch aus.

## Test- und Abnahmestand

Automatisierte Node.js-Tests: `node --test tests/p04_inventory.test.cjs tests/p03_cleaning.test.cjs tests/p02_schedule.test.cjs tests/p02_actions.test.cjs`. Inklusive Einheiten, zweier Bestandssphären, atomaren Planprüfungen, Umlagerungen, Buchung/Korrektur/Undo, Nachkauf und Kosten. Zusätzliche Syntaxprüfung der geänderten JavaScript-Dateien, ZIP-Archivintegrität und Dateireferenzen durchgeführt.

**Nicht abgenommen:** tatsächlicher interaktiver Browser-Klicktest (`ERR_BLOCKED_BY_ADMINISTRATOR` im Container), Android-/Windows-Praxistests, echter Barcode-Scanner, Wiederherstellung großer Backup-Dateien. Daher bleiben die fünf P04-Feature-Checkboxen und die Paketabnahme in Word zunächst offen. GitHub-Upload und ZIP-Bereitstellung werden nur nach Bestätigung markiert.

## Hinweise zur Migration

Eine automatische Zuordnung alter Putzlager-Artikel zu bestehenden Hauptlagerartikeln findet **nicht** statt. Das ist bewusst: Eine stille Umrechnung oder Zusammenführung könnte Mengen doppelt zählen. Alte Putzlagerdaten werden nicht gelöscht. Neue Artikel direkt im Hauptlager erfassen; bei Bedarf manuell Bestände abgleichen, bevor historische Altmaterialien nicht mehr genutzt werden.
