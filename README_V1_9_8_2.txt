MR-HAUSSERVICE 1.9.8.2 – VARIANTE 2 / OPTISCHE ANGLEICHUNG
Datum: 23. Oktober 2026 | Status: TESTVERSION
Basierend auf der vom Nutzer zuletzt hochgeladenen V1.9.8.1-TEST-ZIP.

WAS SICH GEÄNDERT HAT
- Die Oberfläche wurde anhand des bereitgestellten Variante-2-Referenzbilds strukturell neu aufgebaut. Anders als bei 1.9.8.1 nicht nur Farbanpassungen.
- Header: kompaktes Hausservice-Logo links und funktionierende Benachrichtigungs-/Profil-Buttons rechts.
- Oben: zweiteiliger, smaragdgrüner Umschalter Hausservice/Business ↔ Familie & Gesundheit/Privat.
- Business: Begrüßung, Haus-Fotokachel, zweispaltige Cards Aufträge/Kunden/Kalender/Material, Mini-KPIs Finanzen/Arbeitszeit, Schnellzugriffe.
- Business-Navigation: Start, Aufträge, Kalender, Mehr. Bestehendes Lager und Finanzen bleiben über Startseite und weitere vorhandene Bereiche erreichbar.
- Privat: Begrüßung und Zyklus-Fotokachel, zweispaltiges Raster mit 8 Gesundheits-Karten, die die integrierte Frauen-App öffnen (Zyklus, Periode, Ausfluss, Schmerzen, Schwangerschaft, Selbstkontrolle, Lernzentrum, Termine).
- Private-Navigation: Start, Zyklus, Lernzentrum, Mehr. Haushalt bleibt über den privaten Schnellbereich erreichbar.
- Zusätzliche gestaltete Ansicht „Daten übernehmen“ mit echten, schrittweisen Hinweisen und Link zur vorhandenen verschlüsselten .fbackup-Wiederherstellung der Frauen-App. Dies ist KEIN stiller automatischer Import.
- 20 eigenständige SVG-Icons und 2 lokale Bildausschnitte aus dem vom Nutzer bereitgestellten visuellen Referenzbild. Der Nutzer hat damit das stilistische Ziel vorgegeben.
- CSS/Assets sind lokal gebündelt; für die Benutzeroberfläche ist kein Bildabruf aus fremden Domains nötig.

WAS BEWUSST NICHT GEÄNDERT WURDE
- Kein Umzug oder Umformatieren der vorhandenen MR-Daten.
- Frauen-App einschließlich Verschlüsselung, Passwort-Logik, Fotos und Lerninhalten ist im Code unverändert.
- Bestehende MR-Sicherungs-/Google-Drive-Routinen und Women-Vault-Integration sind unverändert.
- Kundenverwaltung ist noch NICHT implementiert und als „In Planung“ gekennzeichnet.
- Es gibt KEINE automatische Live-Synchronisation.

INSTALLATION / WICHTIG
1. VOR DEM UPDATE: MR-Gesamtsicherung und Frauen-App-.fbackup getrennt extern sichern.
2. Diese ZIP entpacken und alle enthaltenen Dateien/Ordner an der bestehenden Stelle ins GitHub-Pages-Repository hochladen. Bilder unter v2_assets/ und Frauen-App-Ordner frauen-app/ unbedingt mitnehmen.
3. GitHub Actions/Pages-Veröffentlichung abwarten; Versionsanzeige sollte 1.9.8.2 sein. Zur Not Website in neuem Tab laden, ohne Website-Daten zu löschen.
4. In den zwei Betriebsarten die Navigation und gespeicherten Einträge prüfen; anschließend testweise sichern und wiederherstellen.
5. Den Import einer .fbackup-Datei nur mit vorhandener Sicherung durchführen und danach Fotos/Einträge kontrollieren.

GEPRÜFT
- 29 JavaScript-Dateien per node --check ohne Syntaxfehler.
- HTML-IDs eindeutig, lokale Assets verfügbar.
- Visualisierungen Business/Privat bei 390x844 px gerendert und optisch geprüft.
- Hashvergleich: women_vault1981.js, backup_google.js und Frauen-App-App-/Lerncode identisch mit V1.9.8.1.
- Test-ZIP wurde auf Dateiintegrität geprüft.

EINSCHRÄNKUNGEN
- Die Bildvorlage ist ein illustrativer UI-Entwurf, kein vorhandenes funktionierendes Programm. Design ist gezielt angenähert, nicht pixelidentisch. Kacheln zeigen reale Funktionen oder als in Planung gekennzeichnete Elemente.
- Kein End-to-End-Test über GitHub Pages auf dem Android-Gerät des Nutzers, keine Anmeldung an dessen Google Drive, kein getesteter Zwei-Geräte-Restore.
- Backup enthält verschlüsselte Frauen-App-Einträge (bei gleicher Origin und intaktem Women-Vault). MR-Gesamtsicherung selbst ist für sonstige Gewerbedaten weiter unverschlüsseltes JSON. Ausschließlich mit gesicherten Daten testen.
