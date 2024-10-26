// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAg7davbJNEMHKorkzEhsDtxKu9g4XgkLI",
  authDomain: "mindly-c5656.firebaseapp.com",
  projectId: "mindly-c5656",
  storageBucket: "mindly-c5656.appspot.com",
  messagingSenderId: "388044604871",
  appId: "1:388044604871:web:e16bbaa32142bd303705e2",
  measurementId: "G-HQVW9THW5S",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
