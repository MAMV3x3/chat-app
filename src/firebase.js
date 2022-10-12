import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage, ref } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC8g1OFK9IghbYQnH5b5YyPOutkK5OC3KI",
  authDomain: "chat-app-bfe0e.firebaseapp.com",
  projectId: "chat-app-bfe0e",
  storageBucket: "chat-app-bfe0e.appspot.com",
  messagingSenderId: "288517377145",
  appId: "1:288517377145:web:ff87ce6292a9e3e65ad8a8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();