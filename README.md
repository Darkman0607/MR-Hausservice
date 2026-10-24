# MR-Hausservice V1.9.9.5 – Kundenverwaltung

- Neues Kundenmodul unter Hausservice → Kunden (vorher Platzhalter).
- Kunden erfassen, bearbeiten, suchen, filtern und archivieren: Name, Firma, Telefonnummer, E-Mail, Straße/Hausnummer, PLZ/Ort, gewünschte Arbeiten, Wiederholung, nächster geplanter Termin, interne Notizen und optional Foto.
- Aufgabencheckliste je Kunde, abhakbar und bearbeitbar, mit Speicherung in der Hauptdatenbank.
- Auftragsübersicht je Kunde, Verknüpfung beim Anlegen neuer Aufträge und Schnellaktion „Auftrag erstellen“.
- Bei älteren Arbeiten ohne ID erfolgt nur eine Anzeige bei **exakter Kunden-Namensübereinstimmung**; es werden keine historischen Daten automatisch umgeschrieben.
- Kunden mit zugeordneten Aufträgen können nicht endgültig gelöscht, sondern nur archiviert werden.
- Kunden sind Teil von `db.customers` und werden wie die übrigen Hauptdaten bei Gesamtsicherungen exportiert und wiederhergestellt.
- Kein Import oder Export persönlicher Kundendaten über GitHub; GitHub enthält ausschließlich den Programmcode.

**Vor dem Update unbedingt eine Gesamtsicherung in der App erstellen.** Nur lokale Tests sind möglich; volle Funktionsprüfung auf Android steht aus.
