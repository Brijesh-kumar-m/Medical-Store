importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCtHgDzilVsbdBLsTW313bSmVSObCSAceI",
  authDomain: "o2clinic.firebaseapp.com",
  projectId: "o2clinic",
  storageBucket: "o2clinic.firebasestorage.app",
  messagingSenderId: "95590780414",
  appId: "1:95590780414:web:c3670b77579f4aebb804af"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification?.title || 'O2Clinic Alert';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new update.',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    vibrate: [200, 100, 200, 100, 200, 100, 200],
    requireInteraction: true,
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
