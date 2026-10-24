# MR-Hausservice V1.9.9.6 – Einkaufsmanager

## Neu
- Separate Einkaufslisten für SPAR, Lidl, HOFER und weitere Geschäfte.
- Artikel mit Packungsgröße, Packungszahl, Barcode/EAN, optional eigenem Foto und Gesamtpreis.
- Gespeicherte Händlerpreise mit Datum und Preisverlauf; Vergleich nur bei identischem Produkt/Barcode.
- Automatische Preisprüfung beim Öffnen der Einkaufsliste (maximal alle 30 Minuten) und manueller Button „Preise aktualisieren“.
- Preis-Feed-Konfiguration pro Geschäft: HTTPS-JSON-Quelle mit CORS, falls ein verlässlicher und rechtmäßig verwendbarer Feed vorhanden ist.
- Optionales Abfragen der Produktstammdaten und Fotos anhand EAN bei Open Food Facts, **nicht** von Händlerpreisen.
- Weiterhin Einkaufsabschluss als einzelne private Ausgabenbuchung; gekauft markierte Artikel werden nicht doppelt gebucht.
- Gekaufte Artikel können optional in eine lokale Vorratsliste übernommen werden (noch **keine** automatische Kopplung mit der geplanten vollwertigen Kühlschrankverwaltung).

## Händlerpreise: wichtige technische Einschränkung
Die statische GitHub-Pages-App enthält **keine offizielle Preis-API von SPAR, Lidl oder HOFER**. Die Händler bieten nicht für jeden Markt eine frei nutzbare, browserbasierte und verlässlich aktuelle Datenschnittstelle. Ohne selbst verbundene, zugängliche Preisquelle sind **keine automatischen aktuellen Ladenpreise** verfügbar. Es werden weder Testpreise vorgegeben noch geschätzte Werte als aktuell ausgewiesen.

### Optionales Feed-Format
Ein GET auf eine HTTPS-Adresse muss JSON und browserübergreifende `Access-Control-Allow-Origin`-Freigabe liefern:

```json
[
  { "barcode": "9000000000001", "name": "Beispielartikel", "packSize": "1 l", "price": 1.99, "date": "2026-10-24" }
]
```

Der Preis bezieht sich auf **eine Packung**. Bei mehreren Packungen wird der Gesamtpreis entsprechend berechnet. Nur Artikel, die über Barcode oder exakt passenden Namen und Packungsgröße zugeordnet werden können, werden aktualisiert. Der Preis wird mit Datum und Quelle gespeichert. Für echte Händlerpreise benötigen Nutzerinnen und Nutzer einen passenden zulässigen Feed.

## Daten / Datenschutz
- Einkauf, Preisverlauf, Preisquellen und Vorratsliste werden in `db.personal.finance.shop1996` gespeichert und von der bestehenden MR-Gesamtsicherung umfasst.
- Bereits gespeicherte Einkaufsartikel und Finanzbuchungen bleiben erhalten. Kein automatisches Löschen privater Daten.
- Die externe Open-Food-Facts-Abfrage ist optional und erfolgt bei ausdrücklichem Tippen auf das Suchsymbol eines Produkts; Open Food Facts: https://world.openfoodfacts.org/ (Open Database License; Fotos teils Creative Commons BY-SA).
- Preisfeed-Aufrufe verbinden sich von deinem Browser aus mit der angegebenen HTTPS-Quelle. Keine Bankdaten an Händler.
- **Vor jeder Aktualisierung:** Gesamtsicherung aus der App exportieren. Die ZIP sichert nur Programmdateien, nicht die lokal gespeicherten Daten. Website-Daten nicht löschen.

## Teststand
JavaScript-Syntaxprüfung für 34 Dateien, isolierte Browser-Funktionstests (Artikel speichern, Preis erfassen, Einkauf buchen, optionaler Vorrat), simulierte Preis-Feed-Aktualisierung und vier Mobilbreiten 320–430 Pixel bestanden. Realer Android- und echte Händler-Preisanbindungen nicht vollständig getestet.
