MR-Hausservice V1.9.1 (Android und Windows – eine Web-App)

Neue Funktionen:
1. Lager: Einheiten Stück, Paar, Packung, Rolle, Flasche, Dose, Sack, Meter, m², ml, l, g, kg; optionale Angaben Gewicht/Volumen je Einheit.
2. Update-Erkennung per version.json auf GitHub Pages beim Öffnen der App; kein Hintergrund-Push.
3. Kleinere Bedienkorrekturen und Datenübernahme.
4. Fotos & Kategorien: gespeicherte Fotos im Vollbildfenster öffnen, davor/danach blättern, schließen.
5. Startseite: Finanz-/Arbeits-/Stunden-Kacheln öffnen die zugehörigen Bereiche.
6. Kalender für Vergangenheit und Zukunft, Tagessummen, geplante Termine, Tagesnotizen, wiederkehrende Termine.
7. Ein oder mehrere Fotos pro zukünftigem Termin; beim Übernehmen in eine Arbeit als Vorher-Fotos mitnehmen.
8. Kalender-Button im grünen Kopfbereich; sechs untere Navigationspunkte aus V1.9 unverändert.
9. Glocke mit In-App-Hinweisen zu bevorstehenden Terminen, knappen Lagerartikeln und Backup.

Datenschutz/Speicherung: kein externes Tracking, weiterhin lokale IndexedDB. Backup Plus JSON sichert auch appointments und dayNotes und ihre Fotos. Bestehende Daten bleiben beim Code-Update erhalten, sofern derselbe Browser-/App-Speicher weiter genutzt wird.

Wichtig: Vor GitHub-Upload in V1.9 Backup Plus JSON herunterladen und in Google Drive sichern. Nie Browserdaten löschen. Im GitHub-Repository nur index.html, sw.js, manifest.webmanifest, version.json, icon-192.png, icon-512.png und README_V1_9_1.txt hochladen. Alte README-Dateien können bleiben. ZIP ist kein Windows-Installer; der PC öffnet dieselbe GitHub-Pages-App im Browser und kann sie installieren. Daten zwischen Geräten werden weiterhin manuell über Backup Plus übertragen.

Nach Veröffentlichung: https://darkman0607.github.io/MR-Hausservice/index.html?v=191

Hinweise: Android/Windows-Systembenachrichtigungen im Hintergrund sind nicht implementiert; die Glocke zeigt Hinweise innerhalb der App. Keine automatischen Google-Drive-Datenabgleiche. Wiedervorlagen bei monatlichen Terminen mit Tag 29–31 werden auf den letzten verfügbaren Tag gekürzt. Tages-Einnahmen hängen am Datum der Arbeit, da separate Zahlungseingangs-Daten noch nicht erfasst werden.
