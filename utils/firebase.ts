// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import * as SecureStore from "expo-secure-store";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2bic1_OHyE5gcuyWLT1KQg_7CsHlt4Cg",
  authDomain: "habitstack-48f66.firebaseapp.com",
  projectId: "habitstack-48f66",
  storageBucket: "habitstack-48f66.firebasestorage.app",
  messagingSenderId: "620849811792",
  appId: "1:620849811792:web:8732800cadaedf294f1c55",
  measurementId: "G-R4X2L3MD5K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// expo-secure-storeを使ったpersistence
const secureStorePersistence = {
  type: 'LOCAL' as const,
  async setItem(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
  },
  async getItem(key: string) {
    return await SecureStore.getItemAsync(key);
  },
  async removeItem(key: string) {
    await SecureStore.deleteItemAsync(key);
  },
};

const auth = initializeAuth(app, {
  persistence: secureStorePersistence
});

export { app, auth };