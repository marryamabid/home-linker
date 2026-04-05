// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-3e1b4.firebaseapp.com",
  projectId: "real-estate-3e1b4",
  storageBucket: "real-estate-3e1b4.firebasestorage.app",
  messagingSenderId: "799262574640",
  appId: "1:799262574640:web:a6fca3ff0a4623df4c85f5",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
