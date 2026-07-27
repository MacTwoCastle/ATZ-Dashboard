# GitHub Pages Setup für ATZ-Dashboard PWA

Dieser Ordner enthält alle Dateien für die GitHub Pages Veröffentlichung und PWA-Installation auf iOS/iPad.

## 📁 Struktur

```
github/
├── manifest.json              # PWA-Manifestdatei
├── service-worker.js          # Service Worker für Offline-Betrieb
├── .nojekyll                  # GitHub Pages Sicherheitsmarker
├── icons/                     # App-Icons
│   ├── icon-192x192.png
│   ├── icon-512x512.png
│   ├── icon-192x192-maskable.png
│   └── icon-512x512-maskable.png
└── screenshots/               # PWA Store Screenshots
    ├── screenshot-540x720.png (Mobil/Portrait)
    └── screenshot-1280x720.png (Tablet/Landscape)
```

## 🎨 Nächste Schritte

### 1. Icons erstellen/hinzufügen
Du benötigst **4 PNG-Dateien** im `icons/`-Ordner:

| Datei | Größe | Beschreibung |
|-------|-------|-------------|
| `icon-192x192.png` | 192×192 px | Android, Web App |
| `icon-512x512.png` | 512×512 px | Splash-Screen, Betriebssystem |
| `icon-192x192-maskable.png` | 192×192 px | Adaptive Icons (Android 13+) |
| `icon-512x512-maskable.png` | 512×512 px | Adaptive Icons (maskable) |

**Optionen:**
- Online-Generator: https://www.pwabuilder.com/imageGenerator
- Oder selbst mit Python/Pillow:
  ```python
  from PIL import Image, ImageDraw
  
  img = Image.new('RGB', (192, 192), color='#003b6e')
  draw = ImageDraw.Draw(img)
  draw.ellipse([32, 32, 160, 160], fill='#e20074')
  img.save('icon-192x192.png')
  ```

### 2. Screenshots (optional)
Für bessere PWA Store-Integration:
- `screenshot-540x720.png` – Mobile Portrait-View
- `screenshot-1280x720.png` – Desktop/Tablet

### 3. HTML-Update
Die Dateien `ATZ-Dashboard.html` und `Rentenrechner.html` müssen folgende Links im `<head>` haben:

```html
<!-- PWA Manifest -->
<link rel="manifest" href="./manifest.json">

<!-- Service Worker Registration -->
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
      .then(() => console.log('Service Worker registered'))
      .catch(err => console.log('SW registration failed:', err));
  }
</script>

<!-- Apple Touch Icons -->
<link rel="apple-touch-icon" href="./icons/icon-192x192.png">
<link rel="icon" type="image/png" href="./icons/icon-192x192.png">
```

### 4. GitHub Pages konfigurieren
1. Push alles zum GitHub-Repo in den `docs/`-Ordner oder nutze `main` Branch
2. GitHub → Settings → Pages → "Deploy from branch" → `main` / `docs`
3. Custom Domain (optional)

### 5. iOS Installation
1. Dashboard in Safari öffnen: `https://deinrepo.github.io/ATZ-Dashboard.html`
2. Teilen-Symbol → "Zum Home-Bildschirm"
3. App wird wie native iOS-App installiert
4. Offline-Zugriff via Service Worker

## 🔧 Für lokale Tests

```bash
# Lokal mit Python starten
python -m http.server 8000

# Dann aufrufen: http://localhost:8000/ATZ-Dashboard.html
# Service Worker funktioniert nur über HTTPS oder localhost
```

## 📝 Checkliste

- [ ] Icons (4×) im `icons/`-Ordner
- [ ] HTML-Dateien aktualisiert (Service Worker + Manifest-Links)
- [ ] Auf GitHub gepusht
- [ ] GitHub Pages aktiviert
- [ ] Auf iPhone getestet: Safari → Teilen → "Zum Home-Bildschirm"
- [ ] Offline-Betrieb getestet (Flugzeugmodus)

## 🔗 Weitere Ressourcen

- [MDN: Web App Manifests](https://developer.mozilla.org/de/docs/Web/Manifest)
- [MDN: Service Workers](https://developer.mozilla.org/de/docs/Web/API/Service_Worker_API)
- [PWA Builder](https://www.pwabuilder.com/)
- [Apple PWA Support](https://developer.apple.com/app-store/pwa/)
