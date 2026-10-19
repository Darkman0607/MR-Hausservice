MR-Hausservice V1.9.5.1 – Notfallkorrektur
Ursache: loadSettings() zeichnete die Schnellzugriffe vor der Initialisierung der const-Konfiguration. Dabei wurde das gesamte JavaScript durch einen ReferenceError unterbrochen.
Fix: Vorzeitigen Aufruf entfernt; initiales Zeichnen erfolgt am Ende der Initialisierung.
Datenspeicher und Datenbanknamen unverändert.
INSTALLATION: Bestehende App NICHT löschen; kein Browserdaten-Reset. Dateien entpacken und GitHub-Dateien ersetzen, dann GitHub Pages Veröffentlichung abwarten.
