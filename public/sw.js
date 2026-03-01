// ========================================
// ComplianceDaddy Service Worker
// PWA + Push Notifications + Offline Support
// ========================================

const CACHE_NAME = 'compliancedaddy-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/vite.svg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker...');

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Caching static assets');
            return cache.addAll(STATIC_ASSETS);
        }).catch((err) => {
            console.error('[SW] Cache failed:', err);
        })
    );

    // Activate immediately
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker...');

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        }).then(() => {
            console.log('[SW] Service worker activated');
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip Firebase and API requests
    if (event.request.url.includes('firebase') ||
        event.request.url.includes('googleapis') ||
        event.request.url.includes('stripe')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cached) => {
            // Return cached version or fetch from network
            if (cached) {
                // Update cache in background
                fetch(event.request).then((response) => {
                    if (response.ok) {
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, response);
                        });
                    }
                }).catch(() => {
                    // Network failed, cached version already returned
                });
                return cached;
            }

            return fetch(event.request).then((response) => {
                // Cache successful responses
                if (response.ok && response.type === 'basic') {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            }).catch(() => {
                // Network failed, return offline page for navigation
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
                return new Response('Offline', { status: 503 });
            });
        })
    );
});

// ========================================
// Push Notifications
// ========================================

// Listen for push events
self.addEventListener('push', (event) => {
    console.log('[SW] Push received:', event);

    let data = {};
    try {
        data = event.data.json();
    } catch (e) {
        data = {
            title: 'ComplianceDaddy',
            body: event.data.text(),
            icon: '/icon-192x192.png',
            badge: '/icon-72x72.png'
        };
    }

    const options = {
        body: data.body || 'New notification from ComplianceDaddy',
        icon: data.icon || '/icon-192x192.png',
        badge: data.badge || '/icon-72x72.png',
        tag: data.tag || 'default',
        data: data.data || {},
        requireInteraction: data.requireInteraction || false,
        actions: data.actions || [],
        vibrate: [200, 100, 200],
        timestamp: Date.now()
    };

    event.waitUntil(
        self.registration.showNotification(
            data.title || 'ComplianceDaddy',
            options
        )
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked:', event);

    event.notification.close();

    const notificationData = event.notification.data;
    let url = '/';

    // Navigate based on notification type
    if (notificationData) {
        switch (notificationData.type) {
            case 'cert_expiry':
                url = '/certifications';
                break;
            case 'incident':
                url = '/incidents';
                break;
            case 'inspection':
                url = '/inspections';
                break;
            case 'checklist':
                url = '/checklists';
                break;
            default:
                url = '/';
        }
    }

    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Focus existing window if open
                for (const client of clientList) {
                    if (client.url.includes(self.location.origin) && 'focus' in client) {
                        client.focus();
                        client.navigate(url);
                        return;
                    }
                }
                // Open new window if not already open
                if (self.clients.openWindow) {
                    self.clients.openWindow(url);
                }
            })
    );
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
    console.log('[SW] Notification closed:', event);
});

// ========================================
// Background Sync (for offline form submissions)
// ========================================
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync:', event.tag);

    if (event.tag === 'sync-inspections') {
        event.waitUntil(syncInspections());
    } else if (event.tag === 'sync-incidents') {
        event.waitUntil(syncIncidents());
    }
});

async function syncInspections() {
    // Implementation for syncing offline inspection data
    console.log('[SW] Syncing inspections...');
}

async function syncIncidents() {
    // Implementation for syncing offline incident data
    console.log('[SW] Syncing incidents...');
}

// ========================================
// Message handling from main app
// ========================================
self.addEventListener('message', (event) => {
    console.log('[SW] Message received:', event.data);

    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});

console.log('[SW] Service worker loaded');