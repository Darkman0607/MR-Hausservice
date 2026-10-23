MR-Hausservice V1.9.7.18 – Reparatur der unvollständigen App-Aktualisierung

1. SERVICE: In V1.9.7.17 war der Code bereits in js/lager2.js enthalten, wurde beim Nutzer aber nicht geladen. Die Versionsanzeige aus index.html allein beweist NICHT, dass JS aktuell ist. Darum werden CSS/JS-Dateien über ?build=19718 neu angefordert. Fehlende Module werden nun mit einer Warnung angezeigt.
2. PDF: Android erhält vorrangig „Mit PDF-App öffnen“ und „Herunterladen“ statt des fehlerhaften PDF-Kachel-iFrames. navigator.share wird mit einer zuvor geladenen PDF synchron beim Tippen gestartet, sodass die Android-Nutzeraktion erhalten bleibt. „Im Browser versuchen“ bleibt als Alternative vorhanden. Ein unabhängiger In-App-PDF-Renderer ist weiterhin NICHT enthalten.
3. UPDATE: SW holt JavaScript/CSS online frisch, hält Offline-Fallback vor, nutzt neues Cache-Namespace. version.json auf 1.9.7.18 geändert.
4. SICHERHEIT: IndexedDB-Schema, Daten, Rechnungen, Lagerbestände, Sicherungen bleiben unverändert. Vor dem Hochladen eine vollständige externe JSON-Datensicherung erstellen und prüfen. NICHT Browserdaten löschen. Bestehende Dateistruktur vollständig ersetzen.
5. TEST: lokale Browsertests und echte Android-Anzeige unterscheiden sich. PDF muss noch auf dem Nutzergerät mit einer PDF-App geprüft werden.
