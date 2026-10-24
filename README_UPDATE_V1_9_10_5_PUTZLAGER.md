# M.R Hauservice V1.9.10.5 – Vernetztes Putzlager

Basis: unveränderte Module P01–P05 und Wohnungskarte V1.9.10.4. P06 ist eine **separate Sondererweiterung** und nicht das bereits geplante Master-Paket P06 (Familienaufgaben).

## Neu

- Eigene Premium-Putzlager-Ansicht unter Haushalt & Putzen, mit Filtern, Kategorien, 3D-Icons, Suche, Zuordnung und Gegenüberstellung zum privaten Hauptlager.
- Artikelmengen bleiben ausschließlich im bestehenden `db.stock` bzw. im vorhandenen privaten Altmaterial. Ausgefilterte Gegenstände (z. B. Verlängerungskabel) werden nicht ins Putzlager kopiert; ein manuelles Ja/Nein überschreibt die automatischen Vorschläge.
- Geschirr- und Putztücher im Stückbestand: sauber / Wäsche, Gesamtmenge im Hauptlager unverändert, Nutzung und Wasch-Rückbuchung einzeln oder alle auf einmal, Historie und Sauberkeitswarnungen. Auch während der Reinigung bedienbar.
- Einkaufsliste aus Mindestbeständen, manuelle Positionen, gespiegelte Warnung auf Privat-Startseite und Lager-Startseite. Keine Nachkaufwarnung nur wegen Tüchern in der Wäsche.
- Manueller Verbrauch über P04-Buchung, Bestand je Lagerort, eindeutige Einmalreferenz, Korrektur/Undo aus P04, individuell einstellbare Mindestmengen.
- Gekaufte Mengen, Geschäft, Datum, Kaufpreis, optional Beleg bis 2 MB, Finanzbuchung **nur nach Häkchen**, inklusive Duplikatschutz per Referenz.
- Flaschengröße pro Artikel und *rechnerische* Anzeige volle Flaschen plus ml-Rest (keine Messung einzelner geöffneter Flaschen).
- Wiederverwendbare Geräte mit Zuständen, ohne Bestandsverbrauch; Materialliste je Raum und Statusprüfung vor der Reinigung.
- Inventurkorrekturen je Artikel und Lagerort mit Begründung und P06-Historie.
- Privat/Gewerbe bleiben getrennt; bestehende P04-Umlagerungsfunktion weiterhin über Hauptlagerartikel erreichbar.

## Bewusst nicht eingeschaltet

- Ablaufdatum/Produkt-Haltbarkeit (Frage 13 = A).
- Barcode-Erkennung, OCR, automatische Neuartikelerkennung und Dublettenabgleich (Frage 17 = jetzt A, später C).
- Vollautomatisches Erkennen realer Mengen angebrochener Flaschen. Keine Schätzungen als Messdaten.

## Tests & Grenzen

- `node --test tests/*.test.cjs` – 69/69 Tests grün am Erstelltag, darunter P06-Pure-Tests und P01–P05-Regressionssuite.
- Sicht-/Fingerbedienung auf Android, Backup-Restore auf einem echten Gerät, Google-Drive-Abgleich und GitHub-Pages-Nutzbarkeit **noch vom Nutzer zu prüfen**.
- P06 liefert eine gefilterte Ansicht. P04/Legacy-Verbrauch bleibt bestehend und absichtlich ohne automatische Datenmigration. Bestehende Bestände und Finanzbuchungen werden nicht ungefragt verändert.
