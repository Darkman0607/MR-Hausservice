MR-Hausservice 1.9.6.4 – kompaktes Auftragslayout

Basis: vom Nutzer hochgeladene V1.9.6.3. Datenbankkennung und bisherige Speicherlogik unverändert.

Neu im Formular "Auftrag anlegen / bearbeiten":
- dunkles Premium-Kartendesign angelehnt an die bestätigte Skizze
- Privat/Offiziell als große Auswahlflächen
- zwei Spalten auf Smartphones für geeignete kompakte Felder
- horizontale Schnellsprungnavigation, gegliederte Bereiche und einklappbare Zusatzwerte
- eigene Karten für Zeit, Tätigkeit, Kunde, Preis, Arbeitsschritte und Beschreibung
- laufend aktualisierte Zeit-/Preiszusammenfassung, Steuer-Vorschau nur bei offiziellen Aufträgen
- großer unten erreichbarer Speicherknopf
- vorhandene Arbeitsfelder, Auftragsdaten, Fotos, Lager und Backup-Logik nicht absichtlich verändert

Wichtig:
- Bilder, Videos und Materialverwendungen werden weiterhin nach dem Speichern in der Detailansicht des Auftrags ergänzt. Sie wurden nicht in den Neuanlage-Dialog verlegt.
- Auftragskalkulator sowie Gerätewartungs-/Reparaturverwaltung sind in dieser ZIP NICHT neu implementiert.
- Vor dem Upgrade JSON-Backup erstellen und separat sichern. Nach GitHub-Upload im Chrome/Android neu laden und 1.9.6.4 kontrollieren.
- Die bestehende App erstellt keine rechtsgültigen Rechnungen durch diese Layoutänderung.

Dateien vollständig auf GitHub hochladen (insbesondere index.html, work1964.css, js/auftrag_layout1964.js, js/verwaltung.js, sw.js, version.json).
Tests: python tests/test_layout1964.py
