MR-Hausservice V1.6 – Arbeiten und Zeiterfassung

Neu:
- „Arbeiten“ als Hauptmenü; Projekte im Arbeitsbereich untergeordnet
- Arbeit mit optionaler Projektzuordnung und Teilaufgaben anlegen/bearbeiten
- Fortschritt automatisch aus abgehakten Teilaufgaben; offene Punkte auf Startseite
- Stoppuhr pro Arbeit mit Start, Pause, Fortsetzen und Abschluss
- Arbeitsphasen in der lokalen Datenbank; Zeit läuft nach Wiederöffnen auf Basis gespeicherter Zeitstempel weiter
- Vorher- und Nachher-Fotos direkt an einzelnen Arbeiten, mehrere Bilder möglich
- Abschließen (nur wenn alle Teilaufgaben erledigt), abgeschlossene Arbeiten in Historie, erneutes Öffnen möglich
- Bestehende Lager-, Projekt-, Foto- und Backup-Bereiche beibehalten

GitHub Pages: Alle sechs Dateien in das Hauptverzeichnis hochladen. ZIP nicht direkt hochladen.
Die App unter https://darkman0607.github.io/MR-Hausservice/index.html?v=16 öffnen.

WICHTIG:
Vor dem Update unbedingt Backup Plus exportieren. Daten liegen weiterhin lokal in IndexedDB.
Eine automatische Cloud-Synchronisierung ist nicht vorhanden.
Echte Android-Tests für Stoppuhr, Fotos, Speichern, Backup und Wiederherstellung sind nach dem Upload erforderlich.
Bei laufendem Timer wird die Zeit aus dem gespeicherten Startzeitpunkt berechnet. Vor langen Pausen „Pause“ drücken.
Arbeitsphasen werden dem jeweiligen Starttag zugeordnet; Aufteilung über Mitternacht ist noch nicht implementiert.
