# MR-Hausservice V1.9.9.3 – Fahrzeugübersicht repariert

## Behobener Fehler
Die Überschrift, Beschreibung und Kennzahlen im Fahrzeug-Dashboard wurden auf Android nebeneinander dargestellt und überlappten. Ursache: Die Fahrzeugübersicht verwendete ein `<header>`-Element und erbte dadurch das globale `display:flex`-Layout der App-Kopfzeile.

- Fahrzeug-Kopfbereich in einen eigenständigen Container umgebaut.
- Titel, Beschreibung und Kennzahlen stehen wieder untereinander.
- Korrektur für schmale Handybreiten und längere Kostenbeträge.
- Die vorhandenen Fahrzeugfunktionen (Tankbuch, Kilometer, Services, Rechnungsfotos) sowie die automatische Finanzanzeige und lokale Datenstruktur wurden **nicht** verändert.
- Versionsnummern und Offline-Cache auf V1.9.9.3 aktualisiert.

**Datenschutz und Sicherung:** Die vollständige ZIP enthält den Programmcode, nicht automatisch die persönlichen Browserdaten. Vor jeder Aktualisierung im Profil eine Gesamtsicherung exportieren; gespeicherte Browserdaten nicht löschen.

## Vorherige Version
# MR-Hausservice V1.9.9.2 – Fahrzeugbuch und Gesamtfinanzen

## Funktionen
- Fahrzeuge beliebig erfassen (Hersteller, Modell, Kennzeichen, Kilometerstand, nächster Service).
- Tankbuch: Datum, Kilometer, getankte Liter, Gesamtpreis, optionale Literpreisangabe, Volltankstatus und Verbrauchsberechnung.
- Service/Reparatur/Pickerl/Versicherung/Reifen/Sonstiges und Erstattung erfassen; pro Eintrag bis zu drei Rechnungsfotos (komprimiert, offline lokal).
- Neu: Finanzzentrale **Privat / Gewerbe / Alle** mit Einnahmen-/Ausgaben-Diagramm für sechs Monate, Herkunft der Buchungen und Gesamtübersicht.
- Tatsächlich erhaltene Hausservice-Beträge werden aus vorhandenen Arbeiten **ohne Kopieren** übernommen; private Arbeitseinträge werden privat, offizielle gewerblich zugeordnet. 
- Fahrzeugausgaben erscheinen automatisch in den Finanzen und aktualisieren sich bei Änderung oder Löschen. Eigene manuelle Buchungen sind Privat oder Gewerbe zuordenbar.
- Private Geräte-Servicekosten aus dem Haushalt werden als Ausgaben angezeigt; reine Lagerwerte, Materialverbrauch, geschätzte Projektkosten und Übungswerte werden nicht als Zahlungen doppelt gezählt.

**Wichtig:** Alle Daten sind lokal in IndexedDB gespeichert. Rechnungsfotos können Sicherungen vergrößern. Vor Update stets Gesamtsicherung **in der App** erstellen; die Programm-ZIP ist keine persönliche Datensicherung. Die Anzeige ist keine steuerlich vollständige Buchhaltung. Keine Bankverbindung, keine Live-Synchronisierung.
