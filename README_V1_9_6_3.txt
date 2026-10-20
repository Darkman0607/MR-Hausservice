MR-Hausservice V1.9.6.3 – Auftragslayout

Auf Grundlage V1.9.6.2, Datenbankkennung unverändert.

Neu:
- Mobile-first Karten in der Auftragsmaske mit Privat-/Offiziell-Umschaltung
- Auftragsdaten übersichtlich gruppiert (Kunde, Kategorie, Datum, Status, Projekt)
- Stunden, Minuten, Stundensatz und direkte Betragvorschau
- Bei offiziellen Aufträgen separat eingeblendete Steuer-/Rechnungs-Vorbereitung
- Neue kompakte Zusammenfassung vor dem Speichern
- Optimierte Abstände und größere Eingabefelder; zwei Spalten am PC
- Bestehende Auftragsfelder und Datenspeicherung weiterverwendet

Tests:
python tests/test_regression.py
python tests/test_version1962.py
python tests/test_layout1963.py

Vor Installation ein vollständiges JSON- und Google-Drive-Backup erstellen.
Zum GitHub-Upload: die Root-Dateien und alle Dateien aus js/ hochladen.
Der neue Code befindet sich unter js/auftrag_layout1963.js.
Echte Cloud-Berechtigung und Android-Speicherung nach Veröffentlichung überprüfen.
Offiziell = Rechnungsvorbereitung, keine rechtsgültige Rechnung.
