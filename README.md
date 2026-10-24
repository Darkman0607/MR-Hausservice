# MR-Hausservice V1.9.9.7 – Kassenzettel-Scanner

## Neu
- Unter Privatfinanzen > Einkauf und Buchungen: **Bon fotografieren** oder **Bon hochladen**.
- Die OCR-Texterkennung liest nach Möglichkeit den Gesamtbetrag, das Datum und den Händler (z.B. SPAR). Die Erkennung nutzt Tesseract.js, das beim ersten Scan online geladen wird. Ohne Verbindung kann der Betrag manuell eingegeben werden; der Beleg bleibt gespeichert.
- **Jeder Beleg wird erst nach Kontrolle des Gesamtbetrags bestätigt und als eine private Ausgabe gebucht**. Doppelte Belege mit gleichem Händler, Datum und Betrag lösen eine Warnung aus.
- Das Belegbild wird platzsparend lokal in der Finanztransaktion gespeichert und kann in Buchungen erneut geöffnet werden. Manuelle Buchungen bleiben unverändert erhalten.
- Bereits vorhandene Finanzdaten, Fahrzeugkosten, Gewerbeeinnahmen und Einkaufslisten werden nicht migriert oder gelöscht.

## Datenschutz und Sicherheit
- Die OCR-Verarbeitung erfolgt im Browser. Für die OCR-Software und Sprachmodelle ist beim ersten Erkennen eine Internetverbindung erforderlich. Es wird **kein Bonbild zur Texterkennung an einen fremden Analyse-Dienst hochgeladen**.
- Der Betrag muss vor dem Speichern mit dem Kassenbon verglichen werden. Ein falsch gelesener Betrag darf nicht ungeprüft gebucht werden.
- Belegbilder werden zusammen mit der lokalen App-Datenbank gesichert. Vor dem Update bitte eine Gesamtsicherung in der App erstellen. Nicht die Android-Browserdaten löschen.
- Händlerpreise werden mit dieser Funktion nicht automatisch abgefragt.
