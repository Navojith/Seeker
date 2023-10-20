// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_M2woT7aTSn2IUAtXSo6DXUnU5fim9uQ",
  authDomain: "seeker-uee.firebaseapp.com",
  projectId: "seeker-uee",
  storageBucket: "seeker-uee.appspot.com",
  messagingSenderId: "52109923043",
  appId: "1:52109923043:web:37d5be1862f8eb2b9c2bd6",
  measurementId: "G-QM0H7VCT9Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
// Initialize Firestore
const FireStore = getFirestore(app);

const storage = getStorage(app);

export { auth, FireStore, storage };
