// public/service-worker.js
self.addEventListener('push', function(event) {
    if (!event.data) {
      console.log('Push event but no data');
      return;
    }
  
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon.png', // Path to icon, if available
      badge: '/badge.png' // Path to badge icon, if available
    };
  
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  });
  