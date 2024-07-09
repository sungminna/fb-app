// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDSgncZH8wboMTKxBQDJZW_vaxvRHch8Po",
  authDomain: "fb-test-e3fe6.firebaseapp.com",
  projectId: "fb-test-e3fe6",
  storageBucket: "fb-test-e3fe6.appspot.com",
  messagingSenderId: "340130943116",
  appId: "1:340130943116:web:2829845ff0a3c4b4dd2ba9",
  measurementId: "G-GZ2WCNVW1P"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { auth, app };
