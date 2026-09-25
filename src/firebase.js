import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAv3WvZKGMJu9s6LT5XuBBwIGn7Lkuoo3U",
  authDomain: "daily-shop-bd.firebaseapp.com",
  projectId: "daily-shop-bd",
  storageBucket: "daily-shop-bd.firebasestorage.app",
  messagingSenderId: "740613379552",
  appId: "1:740613379552:web:bdc429642a33b791968785",
  measurementId: "G-V26H7BFQX7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Services
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
