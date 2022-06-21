import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js';
import {
  getMessaging,
  onBackgroundMessage,
  isSupported,
} from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-messaging-sw.js';

const app = initializeApp({
  projectId: 'fresh-4c845',
  appId: '1:963700420428:web:431be7be7405e53e20a9e9',
  storageBucket: 'fresh-4c845.appspot.com',
  locationId: 'europe-west',
  apiKey: 'AIzaSyDVAIfAlfnSw0pTnFbqW9efCEz2195ZuFw',
  authDomain: 'fresh-4c845.firebaseapp.com',
  messagingSenderId: '963700420428',
  measurementId: 'G-Z77W3HZJGD',
});

isSupported().then((isSupported) => {
  if (isSupported) {
    const messaging = getMessaging(app);

    // TODO configure this
    onBackgroundMessage(
      messaging,
      ({ notification: { title, body, image }  }) => {
        self.registration.showNotification(title, {
          body,
          icon: image || '/assets/icons/icon-72x72.png',
        });
      }
    );
  }
});
