MR-Hausservice V1.9.5.4
Basis: V1.9.5.3

Neu:
- Bei Aufträgen mehrere Vorher-/Nachher-Videos (max. 25 MB je Datei) zusätzlich zu Fotos speichern.
- Videos in der Auftragsgalerie mit Ton abspielen und bildschirmgroß vorzeigen.
- Fünf Hauptnavigationseinträge gleichmäßig über die ganze untere Leiste verteilen, größere Icons.
- Vergrößern durch Fingergeste auf Mobilgeräten per Viewport unterbinden, soweit der Browser dies respektiert.

Datensicherheit:
- Bestehende IndexedDB-Datenbank und Auftragsfoto-Felder werden beibehalten.
- Videos werden als Daten-URLs in den Auftragsdaten gespeichert. Damit sind sie Teil der normalen JSON-Backups, können die Datei aber stark vergrößern und Drive-Backups/Browser-Speichergrenzen belasten.
- Vor dem Upgrade eine getestete JSON-Sicherung erstellen. Nicht die App deinstallieren oder Website-Daten löschen.

Prüfungen:
- JavaScript-Syntax, ZIP-Integrität geprüft.
- Browser-Live-Test in der Laufzeitumgebung durch Administrator blockiert; Tests auf Android und Windows bleiben notwendig.
