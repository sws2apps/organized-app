import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
};

initializeApp(firebaseConfig);

const isDev = process.env.NODE_ENV === 'development';
if (!isDev) {
  const firebaseAnalyticsConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_ANALYTICS_APIKEY,
    authDomain: import.meta.env.VITE_FIREBASE_ANALYTICS_AUTHDOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_ANALYTICS_PROJECTID,
    appId: import.meta.env.VITE_FIREBASE_ANALYTICS_APPID,
    measurementId: import.meta.env.VITE_FIREBASE_ANALYTICS_MEASUREMENTID,
  };

  const appAnalytics = initializeApp(firebaseAnalyticsConfig, 'appAnalytics');
  getAnalytics(appAnalytics);
}
