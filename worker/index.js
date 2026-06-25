// worker/index.js

self.addEventListener('push', function (event) {
  // Pega os dados enviados pelo servidor
  const data = event.data ? event.data.json() : {};
  
  const title = data.title || 'Agenda Inteligente';
  
  // Se o servidor enviou a preferência de vibração do usuário, nós usamos, senão usamos o padrão.
  const vibratePattern = data.vibrate || [200, 100, 200];

  const options = {
    body: data.body || 'Você tem um novo alerta!',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: vibratePattern, 
    data: {
      dateOfArrival: Date.now(),
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Ação de clique: abre a página correta
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(windowClients => {
      // Tenta focar se já estiver aberto
      for (let i = 0; i < windowClients.length; i++) {
        let client = windowClients[i];
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      // Se não, abre nova aba
      if (self.clients.openWindow) {
        return self.clients.openWindow(event.notification.data.url);
      }
    })
  );
});