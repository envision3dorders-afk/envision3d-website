import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ✅ Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwFA-qkuGpXddzL5CY5ItNJR_XZ25ho1w",
  authDomain: "envision3d-orders.firebaseapp.com",
  projectId: "envision3d-orders",

  // ✅ CRITICAL FIX — correct storage bucket
  storageBucket: "envision3d-orders.appspot.com",

  messagingSenderId: "434059997461",
  appId: "1:434059997461:web:cb4fb402e2df00a0bc791c",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Firestore (database)
export const db = getFirestore(app);

// ✅ Firebase Storage (for file uploads)
export const storage = getStorage(app);
