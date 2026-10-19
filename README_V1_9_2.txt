MR-Hausservice V1.9.2 – Dunkel Modern Premium

Neu:
- Vollständiges dunkles Premium-Farbschema nach Designentwurf 2 auf Startseite, Kalender, Arbeiten, Fotos, Lager, Finanzen und Profil.
- Plastische farbige Navigation und Schnellzugriffs-Icons, unverändert sechs untere Tabs.
- Benachrichtigungen einzeln oder gesammelt als gelesen markieren; Glockenzähler verschwindet bei 0.
- Gelesene Meldungen auf Wunsch wieder anzeigen; Lesestatus lokal in den bestehenden Einstellungen gespeichert.
- Versionsanzeige und Versionsprüfung repariert; veröffentlichte version.json liegt im Paket.
- Bestehende Datenspeicherung/Google-Drive-JSON-Backup bleiben erhalten; IndexedDB-Datenbank nicht umbenannt.

SICHERHEIT VOR UPDATE:
- In V1.9.1 unter Profil -> Backup Plus eine JSON-Gesamtsicherung erstellen und separat in Google Drive speichern.
- ZIP entpacken, index.html, sw.js, version.json, manifest.webmanifest und Icons im GitHub-Repository ersetzen.
- Upload mit Commit changes abschließen und GitHub Actions abwarten.
- https://darkman0607.github.io/MR-Hausservice/index.html?v=192 öffnen.
- App auf Android/Windows nicht deinstallieren und Browserdaten nicht löschen.

Prüfstand:
- JavaScript-Syntax, ZIP-Integrität und Browseroberfläche getestet.
- Gelesen/Alle gelesen sowie Zählerrücksetzung mit simuliertem localStorage im Browser getestet.
- Dauerhafte Speicherung und Verhalten auf echten Android-/Windows-Geräten müssen nach Veröffentlichung geprüft werden.
