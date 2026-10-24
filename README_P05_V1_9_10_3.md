# MR-Hauservice V1.9.10.3 · P05 – Reinigungsmittelwissen, Hygiene und Qualität

**Ausgangsbasis:** Nutzer-ZIP `MR_Hauservice_Update_1_9_10_2_P04.zip` (24.10.2026), additive Erweiterung. Bestehende Daten bleiben unverändert erhalten; keine automatische Migration/Bestandszusammenführung. **Vor Installation eine externe App-Gesamtsicherung anlegen.**

## Die fünf P05-Funktionen

- **P05-F01 Oberflächenkunde:** Glas, Fliesen, Holz, Naturstein und Kunststoff mit schonenden Maßnahmen und Gegenhinweisen unter neuem Haushaltsreiter „Wissen & Hygiene“. Stets erkennbar als allgemeiner Vorsichtshinweis (keine Herstellerfreigabe). Beim Reinigen Oberfläche pro Raum auswählen; Prüfung der Produktfreigabe.
- **P05-F02 Herstellerdosierung:** Produktbezogene Dosierung, Bezugsgröße, Einsatzgebiet, belegte Herstellerquelle, Quellenstand und explizit vom Nutzer bestätigter Etikettabgleich je Lagerartikel (auch Altartikel) speichern. Fehlende/unbestätigte Dosierungswerte werden *nicht* als Einsatzempfehlung präsentiert. Keine Herstellerwerte vorgegeben.
- **P05-F03 Dokumente:** Hauptlagerartikel → „Anleitungen & Wissen“ wiederverwenden, inklusive vorhandener PDFs, Fotos, Notizen, Datenblätter und Browser/PDF-App-Fallback. Keine Änderung an der bisherigen PDF-Öffnungsroute. Altbestände bleiben separat zugänglich; Dateianhänge werden nicht dupliziert.
- **P05-F04 Warnungen:** Nutzerseitig aus dem Produktetikett bestätigte Gefahr-/Schutzhinweise, Warnung zu chlorhaltigen + sauren bzw. ammoniakhaltigen Mitteln in derselben Reinigung, Oberflächenverträglichkeit (z. B. Naturstein und Säure) und fehlende Quellen. Allgemeine Gefahrenhinweise sind ausdrücklich keine automatisch bestätigte Produkteinstufung.
- **P05-F05 Qualitätskontrolle:** Vier abschließende Sicht-/Ergebnis-/Schaden-/Nacharbeitsprüfungen, Raumzuordnung für Mängel, Erledigt/Wiedereröffnen, optionale einmalige Folgeaufgabe im vorhandenen Putzplan, Anzeige in abgeschlossenen Reinigungsberichten und Statistik. Vier Prüfungen sind vor Reinigungsabschluss erforderlich; offene Mängel verlangen dokumentierten Teilabschluss.

## Datenmodell & Migration

Neue optionale Properties `stock[].p05Info` oder `personal.household.supplies[].p05Info`, `personal.household.active.p05QA`, `active.p05Defects`, `active.p05SurfaceByRoom` sowie dieselben Felder in beendeten Sitzungen. Die bestehende Sicherung verwendet die vollständigen Datenobjekte; keine Löschung der vorherigen Felder. Folgeaufgaben in `personal.household.tasks[]` mit `p05SessionId`/`p05DefectId`. Medien bleiben weiterhin in den bestehenden lagerbezogenen Dokumentenspeichern.

## QA (24.10.2026)

- `node --test tests/*.test.cjs`: **48 von 48 erfolgreich** (36 P01–P04 + 12 P05).
- JS-Syntax `node --check`: erfolgreich. Lokale Ressourcen, Service-Worker und Manifest überprüft; ZIP-CRC validiert.
- **Noch ausstehend:** realer Browser-Klicktest (Container-Chromium meldet `ERR_BLOCKED_BY_ADMINISTRATOR`), Android/Windows-Bedien- und Foto/PDF-Tests, reale Herstellerquellen/Etikettbelege und Sicherung/Restore mit echten Daten. Diese Freigabeprüfungen dürfen nicht als bestanden eingetragen werden.

**Nutzung:** Privat → Haushalt & Putzen → Wissen & Hygiene bzw. Material → „🧪 Wissen/Dosis“. Dokumente bei Hauptlagerartikel über „📄 Anleitungen & Wissen“. Reinigung → Material wählen → Oberflächenkontext wählen → Qualität prüfen. Quellen selbst anhand der konkreten Herstelleretiketten eintragen.
