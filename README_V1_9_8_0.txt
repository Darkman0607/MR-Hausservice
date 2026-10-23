MR-HAUSERVICE V1.9.8.0 – GRUNDSYSTEM GEWERBE/PRIVAT + HAUSHALT & PUTZEN
23. Oktober 2026

WICHTIG: Dies ist die erste FUNKTIONSFÄHIGE Ausbaustufe des neuen Privatbereichs.
Die übrigen acht privaten Module sind als Bereiche geplant, aber noch nicht programmiert.

NEU: GESAMTSYSTEM
- Oberer Umschalter: „Gemeinsam“, „Gewerbe“, „Privat“.
- Bestehender Gewerbebereich einschließlich Kalender, Lager, Arbeiten, Rechnungen,
  Google-Drive-Dateiaustausch und PDF-Funktionen wurde nicht absichtlich geändert.
- Gemeinsame Tagesübersicht: heutige bestehende Termine, datierte Arbeiten,
  fällige private Putzaufgaben und fällige Haushaltsgerätewartungen.
- Eigene Privat-Startseite; andere geplante Module als gekennzeichnete Platzhalter.
- Privatbereich speichert im bestehenden IndexedDB-Datenbestand unter
  data.personal.household – getrennt von den bestehenden gewerblichen Daten.

NEU: HAUSHALT & PUTZEN – NUTZBARE BASIS
- Mehrere Objekte und frei verknüpfbare Unterbereiche (Haus, Stockwerk, Raum,
  Zone, Schrank, Lagerplatz); Bearbeitung und abgesichertes Löschen.
- Reinigungsaufgaben mit Priorität, Fälligkeitsdatum, einmalig oder wiederkehrend
  alle X Tage/Wochen/Monate; erneute Fälligkeit nach tatsächlicher Erledigung.
- Individuelle Verbrauchsvorschläge für Reinigungsmittel je Putzaufgabe.
- Mehrraumpflege: Stoppuhr, Pause/Fortsetzen, je Raum erfasste Arbeitszeit,
  Checklisten, Fortschrittsanzeige, Notizen, Vorher- und Nachher-Fotos.
- Materialliste mit Mengen, Einheit, Preis je Einheit und Mindestbestand.
- Materialabzug erst nach ausdrücklicher Bestätigung beim Abschließen einer
  Reinigung, mit Prüfung ausreichender Vorräte.
- Reinigungsprotokolle/Verlauf mit Fotos, Materialkosten und Zeiten.
- Geräteverwaltung mit Marke, Modell, Standort, Kauf- und Garantiedatum;
  Wartungsintervallen, Service-/Reparatureinträgen und Kosten.
- Haushaltsstatistiken: Laufzeiten, Anzahl, geschätzte Materialverbrauchswerte,
  Wartungskosten, Monatsvergleich und CSV-Export des Reinigungsverlaufs.

SICHERUNG UND DATEN
- Neu gespeicherte Haushaltsdaten gehören zur bestehenden GESAMTsicherung
  (Profil -> Gesamte App sichern); auch die Wiederherstellung berücksichtigt sie,
  wenn das Backup mit dieser oder einer höheren Version erstellt wurde.
- VOR DEM UPDATE unbedingt eine vollständige Sicherung der bestehenden
  V1.9.7.18 herunterladen und EXTERN ablegen; KEINE Browserdaten löschen.
- VOR DEM RESTORE ebenfalls sichern: Beim Import eines alten Backups ohne
  Privatbereich werden die neueren privaten Einträge überschrieben/entfernt!
- Daten liegen zunächst GERÄTELOKAL. Für Handy <-> Laptop <-> PC weiter
  Datei sichern und am anderen Gerät wiederherstellen, KEIN Live-Sync.
- Verbrauchskosten sind interne Kennzahlen, keine zweite Geldausgabe.

NOCH NICHT ENTHALTEN (GEPLANT)
- Eigene Familienkonten / automatische geräteübergreifende Synchronisation
- Kühlschrank, Einkaufen, Privatfinanzen, Familie/Schule, private Projekte usw.
- Zuverlässige Benachrichtigungen bei geschlossener App / Push-Server
- Erweiterte Haushaltsdiagramme, PDF-/Excel-Export und vollumfängliche Budgetlogik
- Gerätespezifische Reparaturanleitungen, PDF-Anhang je Privatgerät,
  Ersatzteilverwaltung und komplexe Gerätehistorie
- Import/Verknüpfung von bestehendem gewerblichen/privaten Alt-Lager in den
  neuen separaten Haushaltsmaterialbestand (derzeit bewusst getrennt)

INSTALLATION AUF GITHUB PAGES
1. In der aktuell funktionierenden App unter Profil eine Gesamtsicherung erstellen.
2. Den Inhalt dieser ZIP (alle Dateien und Unterordner, NICHT den ZIP-Container)
   im GitHub-Repository über die bestehenden Dateien entpackt hochladen.
3. Auf die GitHub-Pages-Veröffentlichung warten, Seite neu laden.
4. Oben nach dem Start „Privat“ wählen, darunter „Haushalt & Putzen“ öffnen.
5. Auf Smartphone und PC EINMAL mit Testdaten überprüfen, vor umfangreicher Nutzung.
6. Falls die alte Version aus dem Cache erscheint, Seite erneut aktualisieren;
   NICHT Website-Daten/Browser-Speicher löschen.

TESTSTATUS
- Alle JS-Dateien syntaktisch geprüft.
- Browser-Oberflächentest mit Mock-Datenspeicher erfolgreich:
  Objekt/Raum angelegt, Material erfasst, Reinigungsaufgabe erstellt,
  Timer pausiert, Reinigungsabschluss/Verbrauch gespeichert,
  alte Gewerbe-Lagerseite erreichbar, Gerätewartung dokumentiert,
  Daten im Backup-Objekt sichtbar. Keine JS-Laufzeitfehler in diesem Test.
- Einschränkung: Echter Android-, Windows-, IndexedDB-/Service-Worker-
  und Drive-Integrationstest konnte hier nicht auf den Zielgeräten erfolgen.
