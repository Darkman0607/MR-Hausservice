# MR-Hausservice V1.9.9.8 – PDF-Belege in Finanzen

## Neu
- 📄 Finanzbereich: PDF-Kassenbon oder Rechnung direkt hochladen, Vorschau und Download der Datei.
- Automatische lokale PDF-Texterkennung mit PDF.js (wird bei Bedarf aus einer versionierten HTTPS-Quelle geladen); bei gescannten PDFs wird optional die erste Seite mit Tesseract erkannt.
- Geschäft, Betrag und Datum werden nach Möglichkeit vorgeschlagen. Vor dem Buchen müssen die Daten bestätigt werden.
- PDF-Datei wird mit der Buchung in der lokalen IndexedDB-Datenbank gespeichert und ist in der JSON-Gesamtsicherung enthalten.
- PDFs können in der Buchungsliste wieder geöffnet und heruntergeladen werden.
- Einkäufe, manuelle Finanzbuchungen, Fotografieren von Kassenzetteln, Privat/Gewerbe-Filter und Diagramme bleiben erhalten.

## Grenzen
- Max. PDF-Größe 7 MB. Größere PDFs vor dem Import verkleinern.
- PDF-Texterkennung benötigt bei der ersten Verwendung Internet. Ohne Verbindung kann die PDF trotzdem hochgeladen und mit manuell eingetragenem Betrag verbucht werden.
- Bei einem Bild-PDF kann nur die erste Seite per OCR untersucht werden. PDF-Sammelkontoauszüge mit mehreren Buchungen bitte nicht als einen Gesamtbetrag buchen.
- PDFs werden lokal verarbeitet und nicht an einen Dokument-Auswertungsdienst gesendet. Beim Nachladen von PDF.js/Tesseract wird lediglich die Programmkomponente von einem externen CDN abgerufen.
- PDF-Dateien erhöhen die Größe der lokalen App-Daten und aller vollständigen Backups. Vor jedem Update die Daten separat in der App sichern; Browser-/Website-Daten nicht löschen.
- Die App ersetzt keine steuerliche Buchhaltung. Beträge und Belegart immer prüfen.
