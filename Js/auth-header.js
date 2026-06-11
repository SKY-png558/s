// ====================================
// CONTROLE DO ÍCONE DE LOGIN NO HEADER
// ====================================

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyC0V2t-XvpTq_2r_Z0YLc9_-3YF_1c4Mo0",
  authDomain: "samsung-cd18d.firebaseapp.com",
  projectId: "samsung-cd18d",
  storageBucket: "samsung-cd18d.firebasestorage.app",
  messagingSenderId: "582826463476",
  appId: "1:582826463476:web:063e0b28af2d2626d24ea1",
  measurementId: "G-Y3GJJTRXQ0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Verificar autenticação e atualizar header
onAuthStateChanged(auth, (user) => {
  // Encontrar o ícone de usuário no header
  const userIcons = document.querySelectorAll('a[title="Login"] i, a[href="login.html"] i');
  const userLinks = document.querySelectorAll('a[title="Login"], a[href="login.html"]');

  if (user) {
    // Usuário está logado
    userLinks.forEach(link => {
      link.href = 'show.html';
      link.title = 'Meu Perfil';
    });
  } else {
    // Usuário não está logado
    userLinks.forEach(link => {
      link.href = 'login.html';
      link.title = 'Login';
    });
  }
});
