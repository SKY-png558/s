import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

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

export async function cadastrar(email, senha, nome, sobrenome, dataNascimento){
  const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
  return userCredential.user; // 🔑 retorna o usuário
}