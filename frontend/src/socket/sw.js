/**
 * sw.js - Service Worker
 * In react we should keep this inside public folder
 */

// Handle notification click event (When user clicks the banner)
self.addEventListener("notificationclick", (event) => {
  event.notification.close(); // Close the notification popup

  const targetUrl = event.notification.data?.url || "/";

  // Focus existing open tab or open a new window
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === targetUrl && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      }),
  );
});

// Handle push events sent from backend server
self.addEventListener("push", (event) => {
  let data = { title: "New Notification", body: "You have a new message!" };

  if (event.data) {
    data = event.data.json();
  }

  const options = {
    body: data.body,
    icon: "/icon.png",
    data: { url: data.url || "/" },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});
