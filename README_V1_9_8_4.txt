MR-Hausservice V1.9.8.4 – Fehlerkorrekturen, 23.10.2026

Quelle: vollständige V1.9.8.3-ZIP, keine Neuerstellung.

1. Familie & Privat mit drei Hauptreiter-Schaltflächen wie im Referenzbild; 10 Foto-Kacheln aus dem bereitgestellten Layoutbild. Nicht realisierte Module sind klar als geplant markiert.
2. Frauen-Gesundheit: keine laufende Passwortabfrage. Frühere passwortgeschützte Daten benötigen EINMAL das bisherige Passwort. Bereits passwortlose V1.9.8.3-Bestände werden ohne Eingabe auf den neuen Zufallsschlüssel migriert.
3. Der Zufallsschlüssel für Frauen-App-Daten wird in den lokalen Sicherheitsmetadaten gespeichert und ist Teil der Gesamtsicherung. Das verhindert das direkte Entschlüsseln allein anhand des öffentlichen Quellcodes, ABER eine Person mit Zugriff auf die unverschlüsselte MR-Gesamtsicherungsdatei kann die Gesundheitsdaten weiterhin entschlüsseln. Sichere die Datei vertraulich.
4. Haushalt & Putzen: Bildvorschau mit Vergrößerung und Entfernen in der laufenden Reinigung; Speicherung in bestehender IndexedDB, Backup unverändert.
5. Cache-/Service-Worker- und interne Versionsnummern erneuert. Datumsberechnung für private fällige Aufgaben lokal konsistent.

Vor Installation: Gesamtsicherung herunterladen und an sicherem Ort aufbewahren. Nach Update: Frauendaten, Fotos, Kalender, Lager, und Wiederherstellung auf einem Testgerät überprüfen.
