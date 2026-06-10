  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyC0V2t-XvpTq_2r_Z0YLc9_-3YF_1c4Mo0",
    authDomain: "samsung-cd18d.firebaseapp.com",
    projectId: "samsung-cd18d",
    storageBucket: "samsung-cd18d.firebasestorage.app",
    messagingSenderId: "582826463476",
    appId: "1:582826463476:web:063e0b28af2d2626d24ea1",
    measurementId: "G-Y3GJJTRXQ0"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);