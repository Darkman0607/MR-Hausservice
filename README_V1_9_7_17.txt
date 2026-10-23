MR HAUSSERVICE – UPDATE V1.9.7.17
================================
BASIS: V1.9.7.16 (Anleitungen & Wissen)

NEU 1: PDF-ÖFFNUNG VERBESSERT
---------------------------
FEHLER DER VORVERSION:
Der eingebaute PDF-Viewer verwendete eine vorübergehende blob:-URL. Auf
Android wurde dabei teils nur eine PDF-Kachel mit einer zufälligen ID
statt einer lesbaren PDF angezeigt.

LÖSUNG:
• Lager > Artikel > Anleitungen & Wissen > PDF > Öffnen / Ansehen.
• „PDF im Browser öffnen“ öffnet die lokal gespeicherte PDF in einem
  eigenen Tab über einen DATEINAMEN statt der blob:-UUID.
• „Mit PDF-App öffnen“ übergibt die Datei, sofern Android/Web Share das
  Teilen von Dateien unterstützt. Wähle dann eine geeignete PDF-App.
• „Herunterladen“ speichert wie bisher eine PDF zum Öffnen aus „Dateien“.
• „Vorschau hier testen“ stellt eine alternative In-App-Vorschau bereit.
  Manche Android-Browser unterstützen weiterhin keine eingebetteten PDFs.
• Auf Desktop-Geräten bleibt eine eingebettete PDF-Vorschau verfügbar.
• Die im App-Speicher gespeicherten PDF-Dateien werden über den eigenen
  Service Worker lokal bereitgestellt, einschließlich Byte-Range-Abrufen.
  Dafür ist nach dem Update einmaliges Neuladen der App erforderlich.
• PDFs werden NICHT an Fremdserver hochgeladen. Keine externe Bibliothek
  oder Internetverbindung zum Lesen der gespeicherten Datei notwendig.

EINSCHRÄNKUNGEN:
• Nicht jede Android-Version oder Browser-App kann PDFs inline darstellen.
  Deshalb stehen Browser-Tab, PDF-App und Download als Alternativen bereit.
• „Mit PDF-App öffnen“ funktioniert nur bei Browsern mit File Sharing.
• Die vollständige Anzeige wurde nicht auf einem echten Android-Gerät
  verifiziert. Bitte mit deiner Heckenscheren-PDF ausprobieren.

NEU 2: SERVICESTATUS IM LAGER
----------------------------
• Bei JEDEM Artikel (Arbeit/Zuhause, Geräte und sonstige Dinge) lässt sich
  in „Artikeldetails“ ein Häkchen „Service erforderlich“ setzen.
• Die Änderung wird unmittelbar in der bisherigen App-Datenbank gespeichert.
• Ein orangefarbener Schraubenschlüssel erscheint direkt in der Listen- und
  Kachelansicht neben den Artikelaktionen; zusätzlich eine Textmarkierung.
• Im Lager gibt es den neuen Schnellfilter „Service“.
• Unter „Artikel bearbeiten“ kann der Service-Status geändert und eine
  eigene Service-Notiz hinterlegt werden (z.B. Messer laufen nicht).
• Häkchen entfernen = Service erledigt; Warnung verschwindet.
• Beim Duplizieren wird die Service-Markierung NICHT übernommen.
• Die neuen Angaben sind Teil vorhandener vollständiger Backups.

INSTALLATION (GITHUB PAGES)
---------------------------
1. ZUERST in der bisherigen App eine vollständige JSON-Sicherung erstellen
   und AUSSERHALB des Browsers aufbewahren. Google-Drive-Sicherung prüfen.
2. DIE DATEIEN UND UNTERORDNER DES ZIP (nicht den ZIP-Ordner als Unterordner)
   in das bestehende GitHub-Repository hochladen und vorhandene ersetzen.
   Besonders wichtig: index.html, sw.js, version.json, manifest.webmanifest,
   js/lager2.js, js/lager_dokumente19716.js und lager_service19717.css.
3. Nach erfolgreichem GitHub-Pages-Deployment die App neu öffnen/aktualisieren.
   Version 1.9.7.17 muss angezeigt werden.
4. Keine Browserdaten, keinen Cache von Hand und keine IndexedDB löschen.
5. PDF und Service-Häkchen mit einem Testartikel prüfen.

ENTWICKLERKONTROLLEN
-------------------
• JavaScript-Syntaxprüfung für alle JavaScript-Dateien und SW erfolgreich.
• Service-Status und Lagerfilter mit simuliertem Speicher getestet.
• PDF-Service-Worker-Antworten mit simulierter IndexedDB geprüft:
  Vollständige Datei (200), Range (206), Suffix-Range (206),
  Fehlerhafte Range (416), fehlendes Dokument (404).
• ZIP-Verzeichnisse und Service-Worker-Dateiverweise geprüft.
• Browser-GUI-Lauftest und realer Android-/Google-Drive-Lauftest waren in
  dieser Umgebung NICHT möglich. Daher nicht als bestanden angegeben.

BESTANDSSCHUTZ
--------------
Keine Löschung, Zurücksetzung oder Umstellung der bisherigen App-Datenbank.
Bestehende Artikel, Dokumente, Bilder, Mengen, Termine und Backups werden
nicht absichtlich verändert. Vor dem Update trotzdem extern sichern.
