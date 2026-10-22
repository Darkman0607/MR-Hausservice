MR-Hausservice V1.9.7.11 – Korrekturupdate (22.10.2026)

1. Die Versionsangabe wurde in index.html, core.js (Updatecheck und Backups), version.json, Manifest und Service-Worker vereinheitlicht.
2. Lager und Dashboard verwenden jetzt dieselben Bestands-, Nachkauf- und Unvollständig-Regeln. Bei fehlender Menge erscheint kein falscher Nachkaufalarm; Gerät/Werkzeug und nicht überwachte Verbrauchsartikel werden nicht als Nachkauf gezählt. Gemeinsame Artikel werden im Dashboard nur einmal gezählt.
3. Leere Mengen werden als 'nicht erfasst' (null) statt 0 gespeichert. Echte 0 bleibt gültig. Entsprechende Hinweise erscheinen im Lager. +/− verlangt bei fehlender Menge zuerst eine tatsächliche Bestandsaufnahme.

Bestehende gespeicherte Daten werden nicht gelöscht oder automatisch umgeschrieben. Durch frühere App-Versionen bereits fälschlich als 0 gespeicherte Bestände können nicht sicher von echten Nullbeständen unterschieden werden und müssen gegebenenfalls manuell geprüft werden.

Vor dem Update: Gesamtsicherung erstellen. ZIP-Inhalt ins Wurzelverzeichnis des GitHub-Repositories kopieren und gleichnamige Dateien ersetzen. Nie den Browser-/App-Speicher löschen.
