// 1. Register the Service Worker & Setup Notifications
export async function initNotifications() {
  // Check if browser supports Notifications and Service Workers
  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    console.error("This browser does not support web push notifications.");
    return;
  }

  try {
    // Register background worker file (sw.js)
    const registration = await navigator.serviceWorker.register("/sw.js");
    console.log("Service Worker registered successfully!");

    // Check current permission state
    let permission = Notification.permission;

    // Request permission if not already granted or denied
    if (permission === "default") {
      permission = await Notification.requestPermission();
    }

    if (permission === "granted") {
      console.log("Notification permission granted!");

      // Test sending a background notification immediately
      showLocalNotification(registration, {
        title: "Notifications Enabled!",
        body: "Background service worker is ready to handle notifications.",
      });
    } else {
      console.warn("Notification permission was denied by the user.");
    }
  } catch (error) {
    console.error("Error setting up notifications:", error);
  }
}

// 2. Helper function to show notifications using the Service Worker
function showLocalNotification(registration: any, data: any) {
  const options = {
    body: data.body,
    icon: "/icons/user.png", // Path to your icon image
    badge: "/icons/user.png", // Path to small badge icon
    tag: "app-notification", // Prevents duplicate spamming
    data: {
      url: data.url || window.location.origin, // URL to open on click
    },
  };

  // Show notification via Service Worker (works even if tab is in background)
  registration.showNotification(data.title, options);
}

// 3. Attach trigger to a UI button (Browser requirement: user action required)
/*
document.addEventListener("DOMContentLoaded", () => {
  const notifyBtn = document.getElementById("enableNotifyBtn");

  if (notifyBtn) {
    notifyBtn.addEventListener("click", () => {
      initNotifications();
    });
  }
});
*/

// Test Notification Sending
// Step 1: Request permission and send a test notification
export const sendNotification = (icon: string, text: string) => {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      new Notification("New notification received", {
        body: text,
        icon: icon || "https://cdn-icons-png.flaticon.com/512/1827/1827504.png",
      });
    } else {
      console.log("Permission was denied or dismissed.");
    }
  });
};
