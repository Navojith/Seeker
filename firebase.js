// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDSWt-PsY8d8wHQnqkjC1xb_sOXk-1kNSs',
  authDomain: 'seeker-eef7b.firebaseapp.com',
  projectId: 'seeker-eef7b',
  storageBucket: 'seeker-eef7b.appspot.com',
  messagingSenderId: '544300790922',
  appId: '1:544300790922:web:fc72bddcf58c0d21592973',
  measurementId: 'G-QTQWV2RGW2',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
// Initialize Firestore
const FireStore = getFirestore(app);

export { auth, FireStore };
