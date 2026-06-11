// ====================================
// AUTENTICAÇÃO - LOGIN
// ====================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

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
const provider = new GoogleAuthProvider();

// Função de Login com Email
window.fazerLogin = async function() {
  const email = document.getElementById('email')?.value.trim();
  const senha = document.getElementById('senha')?.value;
  const mensagemEl = document.getElementById('mensagem');
  const loadingEl = document.getElementById('loading');
  const loginFormEl = document.getElementById('loginForm');

  if (!email || !senha) {
    if (mensagemEl) {
      mensagemEl.className = 'mensagem erro';
      mensagemEl.textContent = '❌ Preencha todos os campos!';
    }
    return;
  }

  try {
    if (loadingEl) loadingEl.style.display = 'block';
    if (loginFormEl) loginFormEl.style.opacity = '0.5';

    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    // Salvar no localStorage
    localStorage.setItem('userLogged', JSON.stringify({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
    }));

    if (mensagemEl) {
      mensagemEl.className = 'mensagem sucesso';
      mensagemEl.textContent = '✅ Login realizado! Redirecionando...';
    }

    setTimeout(() => {
      window.location.href = 'show.html';
    }, 1500);

  } catch (err) {
    if (loadingEl) loadingEl.style.display = 'none';
    if (loginFormEl) loginFormEl.style.opacity = '1';
    
    if (mensagemEl) {
      mensagemEl.className = 'mensagem erro';
      mensagemEl.textContent = '❌ ' + (err.message || 'Erro ao fazer login');
    }
  }
};

// Função de Login com Google
window.googleLogin = async function() {
  const mensagemEl = document.getElementById('mensagem');
  const loadingEl = document.getElementById('loading');
  const loginFormEl = document.getElementById('loginForm');

  try {
    if (loadingEl) loadingEl.style.display = 'block';
    if (loginFormEl) loginFormEl.style.opacity = '0.5';

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Salvar no localStorage
    localStorage.setItem('userLogged', JSON.stringify({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
    }));

    if (mensagemEl) {
      mensagemEl.className = 'mensagem sucesso';
      mensagemEl.textContent = '✅ Login com Google realizado! Redirecionando...';
    }

    setTimeout(() => {
      window.location.href = 'show.html';
    }, 1500);

  } catch (err) {
    if (loadingEl) loadingEl.style.display = 'none';
    if (loginFormEl) loginFormEl.style.opacity = '1';
    
    if (mensagemEl) {
      mensagemEl.className = 'mensagem erro';
      mensagemEl.textContent = '❌ Erro ao fazer login com Google';
    }
  }
};

// Validação em tempo real
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');

if (emailInput) {
  emailInput.addEventListener('input', function() {
    const msgEl = document.getElementById('mensagem');
    if (msgEl) msgEl.style.display = 'none';
  });
}

if (senhaInput) {
  senhaInput.addEventListener('input', function() {
    const msgEl = document.getElementById('mensagem');
    if (msgEl) msgEl.style.display = 'none';
  });
}
