MR HAUSSERVICE – UPDATE V1.9.7.16
================================
BASIS: V1.9.7.15 (Lagerartikel löschen) – vorhandene Artikel und Daten bleiben erhalten.

NEU: „ANLEITUNGEN & WISSEN“ BEI JEDEM LAGERARTIKEL
-------------------------------------------------
• Lager öffnen (Arbeit oder Zuhause) > Artikel > Details > „📚 Anleitungen & Wissen“.
• Unabhängig von Kategorie/Artikeltyp: Maschinen, Werkzeuge, Reinigungsmittel,
  Ersatzteile und private Gegenstände funktionieren gleich.
• Pro Artikel bis zu 100 verschiedene Einträge:
    - PDF, PNG, JPG, WEBP oder TXT als hochgeladene Datei (maximal 15 MB pro Datei)
    - freie Notizen / Info- und Wartungstexte
    - sichere HTTPS-Links zu Herstellern oder Video-Anleitungen
    - interaktive Wartungs- und Arbeits-Checklisten (Häkchen bleiben gespeichert)
• Titel, Themenrubrik, Quelle/Hersteller, Modell und Beschreibung pro Eintrag.
• Einträge ansehen, bearbeiten und einzeln mit Bestätigung löschen.
• PDF im eingebauten Viewer; falls das auf Android nicht dargestellt wird,
  steht „Herunterladen“ zur Verfügung.
• Beim Duplizieren eines Artikels wird dessen Wissensbereich NICHT dupliziert:
  so entstehen keine versehentlichen Verweise auf fremde Handbücher.

TECHNIK & DATENSICHERUNG
-----------------------
• Metadaten bleiben am Lagerartikel; eigentliche Dateien liegen in einem
  separaten IndexedDB-Dokumentenspeicher, nicht als Bilder im Artikel-Datensatz.
• Bestehende App-Datenbank wird behutsam von Schema 1 auf 2 erweitert,
  Daten und Artikel werden nicht gelöscht oder auf Werkseinstellungen gesetzt.
• Vollständige JSON-Sicherung / Google-Drive-Sicherung und Wiederherstellung
  enthalten die hochgeladenen Dokumentdateien UND ihre Zuordnung zum Artikel.
• Lager-Export enthält ebenfalls Dokumentdateien (Lagerbackup-Format V3);
  „nur neue Artikel hinzufügen“ übernimmt die zugehörigen Dokumente.
• Notfall-Backup im Browser-Speicher kann bei größeren Dateien an der kleinen
  localStorage-Kapazität scheitern. Für Dokumentbestände vollständige JSON-Datei
  bzw. Google Drive verwenden. Rückmeldungen zeigen den Fehler an.
• Wiederherstellungs-Schutzpunkt enthält jetzt auch Dokumentdateien; vor
  Restore weiterhin unbedingt eine EXTERNE Gesamtsicherung anlegen.
• Beim Löschen eines Lagerartikels funktionieren Dokumentverweise mit dem
  vorhandenen Artikel-„Rückgängig“. Nicht mehr benötigte Dateiblobs werden
  beim nächsten App-Start bereinigt (soweit kein Schutzpunkt sie benötigt).
• Alte Sicherungen ohne Dokumente lassen sich weiterhin importieren.
• Alte App-Versionen können die neue Dokumentenfunktion nicht verarbeiten:
  verwende auf Smartphone und Windows möglichst beide V1.9.7.16 oder neuer.

INSTALLATION AUF GITHUB PAGES
----------------------------
1. Vorher in der bisherigen App unter Profil eine vollständige JSON-Sicherung
   erstellen und auf Handy/PC oder Google Drive extern aufbewahren.
2. Alle Dateien/Unterordner DIESES ZIP in dein EXISTIERENDES GitHub-Repository
   hochladen und identische Pfade ersetzen (nicht nur die index.html hochladen).
3. GitHub-Actions / Pages-Veröffentlichung abwarten und die App neu öffnen.
   Angezeigte Version: 1.9.7.16.
4. KEINE Browserdaten, IndexedDB, App-Daten oder Speicher löschen.
5. In Lager > Artikel > Details den neuen Dokumentenbereich öffnen.
6. Mit einem unwichtigen Testartikel: Notiz, PDF, Checkliste, Export,
   Prüfung und Wiederherstellung ausprobieren, ehe du wichtige Handbücher ablegst.

PRÜFUNGEN (ENTWICKLUNG)
---------------------
• Syntaxprüfung aller Javascript-Dateien: bestanden.
• Automatisierter Chromium-Oberflächentest mit simuliertem lokalen
  Datenbankadapter: Artikel erstellen, Notiz anlegen/bearbeiten, PDF hinzufügen,
  herunterladen und sichern, Backup-Wiederherstellung, Checkliste abhaken,
  einzelne Datei löschen, Artikel löschen und rückgängig machen: bestanden.
• ZIP-Struktur, Manifest und Service-Worker werden beim Erstellen geprüft.
• Kein Test an realem Androidgerät und kein echter Google-OAuth-/Cloud-Upload
  möglich. Diese Funktionen bitte nach Veröffentlichung auf deinen Geräten testen.

WICHTIG
-------
• Neue Bedienungsanleitungen werden NICHT automatisch aus dem Internet geladen.
  Füge Hersteller-PDFs/Bilder hinzu oder erstelle eigene Infoblätter und lade sie hoch.
• Reparaturhinweise müssen zu Hersteller, exakter Modellnummer und
  Sicherheitsvorgaben des jeweiligen Geräts passen.
