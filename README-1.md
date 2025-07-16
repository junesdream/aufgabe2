# Aufgabe 2 - Mobile Web Framework (MWF) App

## 📱 Projektbeschreibung

Eine Mobile Web Application entwickelt mit dem MWF Framework, die Anforderungen von MWF1 bis MWF4 erfüllt.

## ✅ Implementierte Features

### MWF1 - Navigation & Listen
- ✅ **Responsive Listenansicht** mit MediaItems
- ✅ **Sandwich-Menü (≡)** zum Wechseln zwischen Ansichten
- ✅ **Medien-Ansicht**: Zeigt alle gespeicherten MediaItems
- ✅ **Künstler-Ansicht**: Zeigt Künstler aus JSON-Daten
- ✅ **Dynamische Header-Titel** ("Medien" / "KÜNSTLER")

### MWF2 - Aktionsmenü
- ✅ **Options-Button (⋮)** bei jedem Listenelement
- ✅ **Dialog mit Aktionen**: "Löschen" und "Editieren"
- ✅ **Kontextabhängige Dialoge** für MediaItems und Künstler
- ✅ **Fehlerbehandlung** und Benutzerbestätigung

### MWF3 - Erstellung & Bearbeitung
- ✅ **+ Button** zum Hinzufügen neuer MediaItems
- ✅ **Dialog "NEUES MEDIUM"** mit Textfeld-Eingabe
- ✅ **Bearbeitungsmodus** für bestehende Items
- ✅ **Formular-Validierung** (Pflichtfelder)
- ✅ **Dynamische Button-Beschriftung** ("Hinzufügen" / "Speichern")

### MWF4 - Leseansicht
- ✅ **Vollbild-Detailansicht** beim Klick auf MediaItems
- ✅ **Zurück-Navigation (←)** zur Listenansicht
- ✅ **Löschen-Funktion (🗑️)** direkt aus der Detailansicht
- ✅ **Responsive Image-Display** der Album-Cover

## 🔧 Technische Implementierung

### Datenpersistierung
- **IndexedDB** für lokale Speicherung der MediaItems
- **JSON-Daten** (`src/data/artists.json`) für statische Künstler-Informationen
- **Automatische Test-Daten** bei leerem Datenbestand

### Framework & Architektur
- **MWF Framework** (Mobile Web Framework) aus dem Skeleton-Template
- **Controller-Pattern** mit `MyInitialViewController.js`
- **Event-driven Architecture** für UI-Interaktionen
- **PWA-Ready** mit Service Worker und Manifest

### Dateien-Übersicht
- **MyInitialViewController.js**: Haupt-Controller mit allen MWF1-4 Features
- **myapp-style.css**: App-spezifische Styles und Responsive Design
- **myapp-theme.css**: Farbschema und Theme-Definitionen
- **app.html**: Main HTML Entry Point
- **artists.json**: Statische Künstler-Daten für MWF1

### CRUD-Operationen
- **Create**: Neue MediaItems über + Button und Dialog
- **Read**: Anzeige in Listen- und Detailansicht
- **Update**: Bearbeitung bestehender Items über Edit-Dialog
- **Delete**: Löschen aus Listen- oder Detailansicht

### UI/UX Features
- **Smooth Animations** beim Löschen von Items
- **Optimistic Updates** für bessere Performance
- **Fehlerbehandlung** mit Benutzer-Feedback
- **Bestätigungsdialoge** für kritische Aktionen

## 📁 Projektstruktur

```
aufgabe2-Kopie [org.dieschnittstelle.iam.mwf.app.skeleton]/
├── src/
│   ├── css/
│   │   ├── myapp-style.css              # App-spezifische Styles
│   │   └── myapp-theme.css              # Theme-Definitionen
│   ├── data/
│   │   ├── artists.json                 # Künstler-Daten (statisch)
│   │   └── media.json                   # Media-Daten (falls vorhanden)
│   ├── img/                             # Album-Cover Assets
│   │   ├── img1.png
│   │   ├── img2.png
│   │   ├── img3.png
│   │   ├── img4.png
│   │   └── img5.png
│   ├── js/
│   │   ├── controller/
│   │   │   ├── MyInitialViewController.js    # Haupt-Controller (MWF1-4)
│   │   │   └── ViewControllerTemplate.js     # Template
│   │   └── model/
│   │       ├── Main.js                       # Main App Entry
│   │       └── MyApplication.js              # App-Konfiguration
│   └── pwa/
│       ├── app.html                          # Main HTML
│       ├── offline.manifest                  # PWA Manifest
│       └── OfflineCacheServiceWorker.js      # Service Worker
├── .gitignore
├── LICENSE
├── package.json                              # Dependencies
├── package-lock.json
├── README.md                                 # Diese Dokumentation
└── README-1.md                              # Zusätzliche Docs
```

## 🚀 Installation & Start

```bash
# Dependencies installieren
npm install

# Entwicklungsserver starten
npm start

# App öffnet sich auf localhost:8080
```

## 🎯 Erfüllte Anforderungen

### MWF1 ✅
- [x] Listenansicht mit MediaItems
- [x] Navigation zwischen verschiedenen Views
- [x] Responsive Design für mobile Geräte

### MWF2 ✅
- [x] Aktionsmenü für Listenelemente
- [x] Dialog-System für Benutzerinteraktionen
- [x] Kontextabhängige Aktionen

### MWF3 ✅
- [x] Dialog zur Erstellung neuer Items
- [x] Bearbeitungsfunktionalität
- [x] Formular-Handling und Validierung

### MWF4 ✅
- [x] Detailansicht (Reading View)
- [x] Navigation zwischen Listen- und Detailansicht
- [x] Vollbild-Display von Medieninhalten

## 🔍 Testing

Die App wurde getestet in:
- **Chrome Device Mode** (empfohlen für mobile Ansicht)
- **Firefox Responsive Design Mode**
- **Desktop Browser** (responsive)

## 📊 Datenmodell

### MediaItem Struktur
```javascript
{
  id: timestamp,           // Eindeutige ID
  title: "Album Name",     // Titel des MediaItems
  src: "img/img1.png",     // Pfad zum Album-Cover
  created: timestamp       // Erstellungszeitpunkt
}
```

### Künstler Struktur (JSON)
```javascript
{
  img: "img/img7.png",                    // Cover-Bild
  artist: "Künstler Name",                // Künstlername
  songCount: "12 SONGS",                  // Anzahl Songs
  date: "23. OKTOBER 2015"                // Veröffentlichungsdatum
}
```

