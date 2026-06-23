// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBGJY9KDSEdM-8EYKuLO3_1a_dUN6kyt6Q",
  authDomain: "strategist-f0d5c.firebaseapp.com",
  projectId: "strategist-f0d5c",
  storageBucket: "strategist-f0d5c.firebasestorage.app",
  messagingSenderId: "41393017006",
  appId: "1:41393017006:web:5b9c04301c901adea25d3f",
  measurementId: "G-VHVGPBTCXM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);