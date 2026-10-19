MR-HAUSSERVICE V1.9.4 – Google-Drive-Direktanbindung

WICHTIG – VOR DER INSTALLATION
1. In der bisherigen App V1.9.3 unter Profil ein JSON-Backup erstellen.
2. Sicherungsdatei unabhängig vom Handy, z. B. in Google Drive, ablegen.
3. App nicht deinstallieren, Browser-Speicher nicht löschen.

INSTALLATION
- ZIP entpacken.
- Dateien index.html, sw.js, version.json, manifest.webmanifest und die zwei Icons
  in das bisherige GitHub-Repository MR-Hausservice hochladen/ersetzen.
- Upload durch Commit changes bestätigen.
- GitHub Pages Actions bis zur erfolgreichen Veröffentlichung abwarten.
- https://darkman0607.github.io/MR-Hausservice/index.html?v=194 öffnen.
- Auf Windows dieselbe URL verwenden.

EINMALIGE GOOGLE-EINRICHTUNG (kann am Handy erfolgen)
1. https://console.cloud.google.com öffnen; eigenes Google Cloud Projekt erstellen.
2. Google Drive API aktivieren.
3. Google Auth Platform / OAuth-Zustimmungsbildschirm einrichten.
   Testnutzer bei Bedarf mit dem eigenen Google-Konto anlegen.
4. OAuth-Client-ID vom Typ WEBANWENDUNG erstellen.
   Autorisierte JavaScript-Quelle: https://darkman0607.github.io
   (kein Verzeichnispfad, keine abschließende /).
5. Im App-Bereich Profil -> Google Drive die Client-ID eintragen und speichern.
6. Mit Google verbinden, beim eigenen Konto die Drive-Berechtigung bestätigen.

NUTZUNG
- Am Handy: Profil -> In Google Drive sichern.
- Am Windows-PC: Profil -> Mit Google verbinden -> Sicherungen anzeigen -> gewünschte Sicherung laden.
- Vor dem Laden IMMER einen eigenen Backup-Export des bisherigen Geräts machen.
- Die Sicherungen liegen als Dateien im Google-Drive-Ordner "MR-Hausservice Backups".
- Das ist manuelle Sicherung/Wiederherstellung, KEINE Live-Synchronisierung.
- Der Browser kann für neue Google-Sitzungen eine erneute Zustimmung verlangen.
- Access Tokens werden nur für die laufende App-Sitzung gehalten. Die öffentliche Client-ID
  wird lokal auf jedem Gerät gespeichert. Keine Passwörter oder Client-Secrets in die App eingeben.

TESTGRENZE
- JavaScript-Syntax geprüft und ZIP validiert. Der Test-Browser blockierte die lokale
  Website; der echte Google OAuth-/Drive-Aufruf muss auf der veröffentlichten HTTPS-Seite
  mit der eingerichteten Google-Client-ID durch den Nutzer getestet werden.
- Falls die API/Freigaben noch nicht eingerichtet wurden, bleiben manuelle JSON-Backups verfügbar.
