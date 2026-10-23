MR-HAUSSERVICE V1.9.8.5 – PRÜF-/KORREKTURVERSION (23.10.2026)

Basis: vollständiges V1.9.8.4-Archiv. Kein Eingriff in vorhandene Datenschemata oder Löschen von Bestandsdaten.

Korrekturen:
- Doppelte Hauptreiter wurden überprüft: Die Familienstartseite aus V1.9.8.4 verwendet bereits ausschließlich die globale Navigation. Diese bleibt erhalten.
- "Mehr" unten öffnet jetzt tatsächlich eine Übersichtsseite mit Gesundheit, Haushalt, Kalender, Datenübernahme und Gesamtsicherung.
- Foto-Löschen: asynchroner Fehler wird behandelt.
- Backup-Wiederherstellung: Frauen-Datenbank wird vor der Übernahme geprüft. Falls das Frauen-App-Wiederherstellen nach dem Schreiben der MR-Daten fehlschlägt, wird der vorherige MR-Datenstand samt überschriebenen Dokumentanhängen zurückgespielt.
- Neue Cache- und Versionsnummer; .nojekyll für GitHub Pages.

WICHTIG: Mindestens ein externes Gesamtdaten-Backup erstellen und seine Größe prüfen, bevor du diese Version installierst. Nicht die Android-Website-Daten löschen.
Die passwortlose Frauen-App hat eine lokale Verschlüsselung, deren Schlüssel in der gesicherten Datenstruktur mit enthalten ist. Backups vertraulich behandeln.

Tests: JS-Syntax, HTML-/Serviceworker-Dateiverweise, Haushalt-Kerndaten, Datenpersistenz-Schema und ZIP-Integrität intern überprüft. Vollständiger Android-/Google-Drive-/GitHub-Pages-End-to-End-Test nicht möglich, solange die Website nicht auf deinem Gerät ausgeführt wird und GitHub-Ausführungslogs nicht vorliegen.

GitHub-Hinweis: Browser-Upload max. 100 Dateien je Vorgang. Die Vollversion umfasst mehr als 100 Dateien. Zum Hochladen aller Dateien in einem Commit bitte GitHub Desktop/git verwenden. Für ein bereits vollständig installiertes V1.9.8.4-Repository gibt es zusätzlich ein kleines Korrekturpaket mit nur den geänderten Dateien; dieses funktioniert nur, wenn alle V1.9.8.4-Dateien bereits im Repo vorhanden sind.
