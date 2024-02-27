import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAP9gnm16Kec_2887v7lGBmPIzLBTDG2bE",
  authDomain: "task-60211.firebaseapp.com",
  projectId: "task-60211",
  storageBucket: "task-60211.appspot.com",
  messagingSenderId: "38304192919",
  appId: "1:38304192919:web:670857badcf2edaa020cd2",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
