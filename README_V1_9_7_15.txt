MR-Hausservice – Update V1.9.7.15
====================================
Basis: V1.9.7.14 (Lager Vorschlag 3 + 3D-Icons)

NEU – Lagerartikel löschen:
• Lager > Arbeit oder Zuhause > Kategorie oder Alle Artikel: Papierkorb direkt rechts an jeder Artikelzeile.
• Kachelansicht: zusätzliche Schaltfläche „🗑 Löschen“.
• Auch in Artikeldetails: „🗑 Artikel löschen“, separat hervorgehoben.
• Bestätigung mit Artikelname und den Optionen Abbrechen / Artikel löschen.
• Bestände, Bilder und Bestandsverlauf nur für den gewählten Artikel entfernen; alle anderen Artikel, Arbeiten und Finanzen bleiben unverändert.
• Rückgängig-Leiste über der Artikelliste, solange die App offen bleibt.
• Speicherung in vorhandener IndexedDB – keine Datenmigration, kein Zurücksetzen.
• Bei fehlgeschlagener Speicherung wird der Artikel im laufenden Datenbestand wiederhergestellt.

INSTALLATION
1. Zuerst Gesamtsicherung der App über Profil / Backup anfertigen und extern aufbewahren.
2. Sämtliche Dateien und Ordner dieses ZIPs in das bestehende GitHub-Repository hochladen (vorhandene Dateien ersetzen).
3. GitHub Pages/Actions-Veröffentlichung überprüfen und die App neu öffnen.
4. App-Version 1.9.7.15 prüfen. Keine Browserdaten, kein IndexedDB und keinen App-Speicher löschen.
5. Mit einem unkritischen Testartikel Löschen, Abbrechen und Rückgängig ausprobieren.

WICHTIG: Rückgängig ist nur verfügbar, solange die App geöffnet bleibt; nach Neuladen hilft eine vorher erstellte Sicherung.
Automatisierte Prüfungen sind kein vollständiger Test auf dem eigenen Android-Gerät.
