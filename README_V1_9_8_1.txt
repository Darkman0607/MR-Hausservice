MR HAUSSERVICE V1.9.8.1 – VARIANTE 2 / INTEGRIERTE FRAUEN-APP
23.10.2026 – Entwicklungs-/Testversion auf Basis V1.9.8.0 + Frauen-App Beta 0.1.9.3

NEU
• Oben zwei klare Umschalter Hausservice / Familie & Gesundheit (Privat).
• Premium-Dark-Design angelehnt an ausgewählte Bild-Variante 2: Anthrazit/Smaragd, leuchtende Icons, Karten, Privat-Dashboard.
• Privat-Navigation mit Start, Haushalt, Frauen-App und Heute. Die bestehende Tagesübersicht bleibt erreichbar.
• Frauen-App mit allen vorhandenen Funktionen wird UNVERÄNDERT in einem internen App-Bereich verwendet (als lokale Unterseite mit eigener verschlüsselter IndexedDB). Das dunkle Farbschema wird angeglichen.
• Keine Duplikation/Mischung der Gesundheitsdaten mit db.personal.household oder Gewerbe.
• MR-GESAMTBACKUP / GOOGLE DRIVE: Die Sicherung enthält die bereits AES-GCM-verschlüsselten Frauen-App-Datensätze aus der lokalen frauen-app-beta-Datenbank inkl. Fotos und Passwort-Prüfmetadaten; nicht die Klartextdaten. Google Drive über das bereits bestehende OAuth/Drive-Verfahren, manuell über Profil.
• Beim Laden eines neuen Gesamtsicherungsformats werden vorhandene Frauen-App-Daten durch das verschlüsselte Backup ersetzt; ein lokaler Schutzpunkt unter Schlüssel women_pre_restore wird zuvor versucht. ALTE MR-SICHERUNGEN ohne Frauen-Vault lassen bestehende Frauendaten unberührt.

WICHTIG VOR INSTALLATION
1. MR V1.9.8.0: Profil → Gesamte App sichern. Backup extern sichern.
2. Bisherige Frauen-App: Akte / Backup → verschlüsselte .fbackup erstellen und EXTERN ablegen; Passwort bewahren.
3. Dateien aus dieser ZIP ins bestehende MR-GitHub-Pages-Repository hochladen, Ordner frauen-app/ unbedingt als Ordner erhalten.
4. In MR zuerst Privat → Frauen-App öffnen, ein eigenes Datenpasswort (min.12 Zeichen) vergeben. Von der ALTEN Frauen-App auf anderer GitHub-URL werden Daten NICHT automatisch übernommen (Browser-Origin-Trennung). Über Frauen-App → Akte / Backup → Wiederherstellen die bestehende .fbackup importieren. Beim Import vorhandene Daten dort ersetzen; vorher sichern!
5. Anschließend über MR → Profil → Google Drive das GESAMTBACKUP sichern. Darin sind die verschlüsselten Frauendaten enthalten, falls die Frauen-App im selben Browser/Ursprung initialisiert wurde.
6. Auf dem PC: gleiche Version öffnen, MR-Gesamtsicherung aus Drive laden; danach Frauen-App öffnen und mit dem alten Frauen-App-Datenpasswort entsperren. (Wenn das Backup die alten verschlüsselten Datensätze trägt, gilt das Passwort der QUELL-DB.)
7. Niemals Daten des Browsers / der GitHub-Pages-Seite löschen, bis die wiederhergestellten Einträge/Fotos überprüft wurden.

SICHERHEIT / EINSCHRÄNKUNGEN
• MR-Gewerbedaten liegen weiterhin unverschlüsselt im JSON-Backup. Nur der Frauen-Vault ist separat AES-GCM-verschlüsselt. Beim Wiederherstellen öffnet sich die verschlüsselte Datenbank nur mit ihrem bisherigen Passwort.
• Der MR-Restore legt die verschlüsselte Frauen-Datenbank bei Bedarf neu an. Danach ist das ursprüngliche Passwort des gesicherten Frauen-Vaults erforderlich.
• Keine echte Live-Synchronisierung oder automatische Google-Drive-Sicherung; Nutzer löst Sichern / Laden manuell aus.
• Lokal gespeicherte Lernkapitel-Häkchen der Frauen-App werden in diesem ersten gemeinsamen Backup noch nicht übertragen, weil sie bislang unverschlüsselt im localStorage liegen. Ihre Texte/Bilder und verschlüsselten Einträge werden übernommen.
• Bestehender Frauen-App-Lernstoff ist auf Code-Ebene enthalten, nicht medizinisch neu bewertet.
• Die GIF/Blumen/Personen aus dem KI-ENTWURFSBILD sind Inspirationsvorlagen, keine übernommenen urheberrechtlichen Bilddateien. SVG-Icons sind eigenständig nachgestaltet.
• Design und Backup-Logik intern testbar, aber noch kein echter Feldtest auf dem Android-Zielgerät, Google OAuth mit konkretem Nutzerkonto oder Benutzer-Passwort-/Foto-Restore auf Windows. DIESES ZIP BITTE ALS TESTVERSION BEHANDELN, bevor produktive Daten ausschließlich damit verwaltet werden.
