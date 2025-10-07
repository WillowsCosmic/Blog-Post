// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getEnv } from "./getEnv";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API'),
  authDomain: "blogpost-7de0e.firebaseapp.com",
  projectId: "blogpost-7de0e",
  storageBucket: "blogpost-7de0e.firebasestorage.app",
  messagingSenderId: "691643666347",
  appId: "1:691643666347:web:8ef0c752b762927e49ccee",
  measurementId: "G-7M4PFMWV3N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth,provider}
