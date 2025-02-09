// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY, // Firebase API key
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN, // Authentication domain
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID, // Project ID
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET, // Storage bucket
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID, // Messaging sender ID
  appId: process.env.REACT_APP_FIREBASE_APP_ID, // Firebase app ID
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID, // Analytics measurement ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app); // Initialize Firestore

export default auth; // Keep default export unchanged
export { analytics, firestore }; // Export Firestore and analytics explicitly