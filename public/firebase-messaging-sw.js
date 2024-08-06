/* eslint-disable no-undef */

// Create for future FCM use

try {
  importScripts(
    'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js'
  );
  importScripts(
    'https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js'
  );

  class CustomPushEvent extends Event {
    constructor(data) {
      super('push');

      Object.assign(this, data);
      this.custom = true;
    }
  }

  self.addEventListener('push', (e) => {
    // Skip if event is our own custom event
    if (e.custom) return;

    // Kep old event data to override
    const oldData = e.data;

    // Create a new event to dispatch, pull values from notification key and put it in data key,
    // and then remove notification key
    const newEvent = new CustomPushEvent({
      data: {
        ehheh: oldData.json(),
        json() {
          const newData = oldData.json();
          newData.data = {
            ...newData.data,
            ...newData.notification,
          };
          delete newData.notification;
          return newData;
        },
      },
      waitUntil: e.waitUntil.bind(e),
    });

    // Stop event propagation
    e.stopImmediatePropagation();

    // Dispatch the new wrapped event
    dispatchEvent(newEvent);
  });

  // "Default" Firebase configuration (prevents errors)
  const defaultConfig = {
    apiKey: true,
    projectId: true,
    messagingSenderId: true,
    appId: true,
  };

  // Initialize Firebase app
  firebase.initializeApp(defaultConfig);
  const messaging = firebase.messaging();

  //Listens for background notifications
  messaging.onBackgroundMessage((payload) => {
    //customise notification
    const notificationTitle = payload.data.title;
    const notificationOptions = {
      body: payload.data.body,
      icon:
        payload.data.image || 'https://guide.organized-app.com/img/logo.svg',
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
} catch (error) {
  console.error(error);
}
