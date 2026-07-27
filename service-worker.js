// Service Worker für ATZ-Dashboard PWA
// Offline-Unterstützung und Cache-Strategie

const CACHE_NAME = 'atz-dashboard-v1';
const ASSETS_TO_CACHE = [
  './',
  './ATZ-Dashboard.html',
  './Rentenrechner.html',
  './manifest.json'
];

// Installation: Cache initialisieren
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache erstellt');
        return cache.addAll(ASSETS_TO_CACHE)
          .catch(err => console.log('Cache add error:', err));
      })
      .then(() => self.skipWaiting())
  );
});

// Aktivierung: alte Caches löschen
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Alten Cache gelöscht:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Offline-first Strategie
self.addEventListener('fetch', event => {
  // Nur GET-Anfragen handeln
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Im Cache gefunden -> zurückgeben
        if (response) {
          return response;
        }

        // Nicht im Cache -> Network versuchen
        return fetch(event.request)
          .then(response => {
            // Nur erfolgreiche Responses cachen
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }

            // Response klonen und cachen
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Network fehler -> Offline-Fallback
            console.log('Offline - verwende gecachte Version für:', event.request.url);
            // Optional: Fallback-Seite zurückgeben
            return caches.match('./ATZ-Dashboard.html');
          });
      })
  );
});

// Periodic Background Sync (optional - für zukünftige Daten-Updates)
self.addEventListener('periodicsync', event => {
  if (event.tag === 'sync-data') {
    event.waitUntil(
      fetch('./data.json')
        .then(response => response.json())
        .then(data => {
          // Daten in IndexedDB oder LocalStorage speichern
          console.log('Service Worker: Daten synchronisiert');
        })
        .catch(err => console.log('Sync error:', err))
    );
  }
});
