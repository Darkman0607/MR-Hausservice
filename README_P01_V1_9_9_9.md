# M.R Hauservice V1.9.9.9 · Update P01 / 9

Ausgangsbasis: V1.9.9.8.

## Funktionen
- **P01-F01**: Raumprofile mit Fläche, Bodenbelag, Oberflächen, Besonderheiten, Notizen und bis zu zwölf Raumfotos.
- **P01-F02**: Bearbeitbare Reinigungszonen in Räumen; Aufgaben können jeder Zone zugeordnet und bei Raumreinigung abgehakt werden.
- **P01-F03**: Wiederverwendbare Vorlagen für Küche, Bad, WC, Wohnzimmer, Schlafzimmer, Flur und Arbeitszimmer mit Zonen und Standardaufgaben, additiv ohne Überschreiben.
- **P01-F04**: Status pro Raum über gespeicherte Reinigungsaufgaben und Fälligkeiten (überfällig, bald fällig, erledigt/geplant; ohne Aufgaben kein Putzplan).
- **P01-F05**: Vorhandener frei gezeichneter Wohnungsplan mit anklickbaren Raumumrissen und Fälligkeitsstatus. Bestehende Zeichnungen bleiben unverändert.

## Technischer Datenerhalt
Bestehende `db.personal.household.places`, `tasks`, `sessions` und `floorplan` bleiben erhalten. Raumprofile sind ein optionales `profile`-Objekt innerhalb vorhandener Raumeinträge, ohne neue Datenbank. Raumfotos sind Bilddaten im Backup. Vor Updates und bei Gerätewechseln immer Gesamtsicherung exportieren.

## Besonderheiten
- Vorlagen werden bei Raum-Bearbeitung freiwillig angewendet; doppelte Standard-Zonen/-Aufgaben werden vermieden.
- Löschen einer Zone mit abhängigen Aufgaben wird absichtlich blockiert, bis die Aufgaben umgehängt oder entfernt wurden.
- Sauberkeitsstatus basiert auf den gespeicherten Intervallen, nicht auf Sensoren oder optischer Prüfung.
- Android-/Windows-Endgerätetest ist getrennt von automatisierten Browser-Tests durchzuführen.
