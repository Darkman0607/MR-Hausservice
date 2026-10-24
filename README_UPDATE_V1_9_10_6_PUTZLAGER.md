# MR-Hauservice V1.9.10.6 – Putzlagerkorrekturen

Stand: 25.10.2026. Grundlage: V1.9.10.5, unveränderte Bestandsquelle `db.stock`.

## Korrekturen (5 Punkte)

1. **Reinigungsfilter / Opt-in:** Das Putzlager zeigt automatisch nur eindeutig zuordenbare Reinigungsartikel aus den vorhandenen privaten Beständen. Nicht passende Dinge (z. B. Verlängerungskabel, Steckdosenleisten, Maler- und Gartenzubehör) werden ausgeblendet. Unter **Zuordnung** kann jeder Artikel gezielt hinzugefügt oder wieder ausgeschlossen werden. Vorhandene Artikel werden nicht gelöscht oder kopiert.
2. **Handschuhe – Schnellerfassung:** Material Nitril/Latex/Vinyl/Andere, Farbe Weiß/Blau/Pink/Schwarz/Andere, Lagerort und Stückzahl in **Paar**. Großmengen über Schnellfelder 10/50/100/200/500 Paar. Jeder Durchlauf kann eine neue Handschuhsorte anlegen oder durch ausdrückliche Auswahl den Bestand einer vorhandenen Sorte erhöhen; keine automatische Zusammenführung. Bei existierender Einheit „Stück“ rechnet der Dialog sichtbar 1 Paar = 2 Einzelhandschuhe.
3. **Hauptmenü bereinigt:** Auf der Putz-Hauptseite exakt eine Kachel **Geräte**, genau eine **Statistik**, ein eigener **Putzlager**-Einstieg; alte positionsbasierte Tab-Umetikettierung entfernt. Wissen & Hygiene bleibt unter eigenem Zugang erhalten, die frühere Materialverwaltung ist über die erweiterten Funktionen erreichbar.
4. **Einheitlicher Reinigungsfilter in Material-Ansichten:** Die Alt-/P04-Liste und die Materialauswahl einer Reinigung blenden nicht freigegebene Hauptlagerartikel aus. Die zentrale Hauptlagerliste bleibt vollständig erhalten.
5. **Mobile Bedienung & Prüfungen:** Große Handschuh-Schnellfelder, platzsparendes Modal, 8 klare Hauptkacheln, Regressions- und Browser-Simulation inklusive echter Modalaktion (ohne echtem Androidgerät).

## Prüfung

- 79/79 automatisierte Node-Testfälle bestanden, darunter 10 neue P07-Fälle.
- Chromium-Browser-Simulation: Putzlager zeigt Reiniger und Handschuhe, aber kein Verlängerungskabel; Handschuhdialog mit 500-Paar-Schnellwert und Speicherung erfolgreich, keine JavaScript-Laufzeitfehler.
- Syntaxprüfungen der geänderten JavaScript-Dateien bestanden.
- Noch offen: Test auf realem Vivo-Smartphone, reale Backup-/Wiederherstellungsprobe, Sichtprüfung aller Altartikel einschließlich Sonderkategorien.

## Aufgepasst

- Vor einem Update eine vollständige Sicherung exportieren und aufbewahren.
- Die Angabe von rund 800 Paar Handschuhen ist kein importierter Bestand. Der Benutzer muss die tatsächlich gezählten Mengen eintragen. Bestehende Handschuhartikel bleiben unverändert, bis eine konkrete Sorte ausgewählt und aufgefüllt wird.
- Es werden **keine** Ablaufdaten oder Barcode-Automatik aus späteren Planungsvarianten eingeführt.
- Die vorhandenen P01–P06-Funktionen und die Wohnungskarte werden nicht absichtlich verändert.
