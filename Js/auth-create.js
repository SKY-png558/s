// ====================================
// AUTENTICAÇÃO - CRIAR CONTA
// ====================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

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
const db = getFirestore(app);

const formulario = document.getElementById('cadastro');
const mensagemEl = document.getElementById('mensagem');
const loadingEl = document.getElementById('loading');

if (formulario) {
  formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome')?.value.trim();
    const sobrenome = document.getElementById('sobrenome')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const telefone = document.getElementById('telefone')?.value.trim() || '';
    const dia = document.getElementById('dia')?.value;
    const mes = document.getElementById('mes')?.value;
    const ano = document.getElementById('ano')?.value;
    const senha = document.getElementById('senha')?.value;
    const confirmar = document.getElementById('confirmar')?.value;
    const termos = document.getElementById('termos')?.checked;

    // Validações
    if (!nome || !sobrenome || !email || !dia || !mes || !ano || !senha || !confirmar) {
      mostrarMensagem('❌ Preencha todos os campos obrigatórios!', 'erro');
      return;
    }

    if (!termos) {
      mostrarMensagem('❌ Você deve concordar com os termos de serviço!', 'erro');
      return;
    }

    if (senha !== confirmar) {
      mostrarMensagem('❌ As senhas não correspondem!', 'erro');
      return;
    }

    if (senha.length < 6) {
      mostrarMensagem('❌ A senha deve ter pelo menos 6 caracteres!', 'erro');
      return;
    }

    try {
      if (loadingEl) loadingEl.style.display = 'block';
      if (formulario) formulario.style.opacity = '0.5';

      // Criar usuário
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      // Atualizar perfil com nome completo
      await updateProfile(user, {
        displayName: `${nome} ${sobrenome}`
      });

      // Salvar dados adicionais no Firestore
      const dataNascimento = `${dia}/${mes}/${ano}`;
      await setDoc(doc(db, 'usuarios', user.uid), {
        nome,
        sobrenome,
        nomeCompleto: `${nome} ${sobrenome}`,
        email,
        telefone,
        dataNascimento,
        criadoEm: new Date().toISOString(),
        notificacoes: true,
        newsletter: true,
        publicidade: false
      });

      // Salvar no localStorage
      localStorage.setItem('userLogged', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: `${nome} ${sobrenome}`
      }));

      mostrarMensagem('✅ Conta criada com sucesso! Redirecionando...', 'sucesso');

      setTimeout(() => {
        window.location.href = 'show.html';
      }, 1500);

    } catch (err) {
      if (loadingEl) loadingEl.style.display = 'none';
      if (formulario) formulario.style.opacity = '1';
      
      let mensagem = '❌ Erro ao criar conta';
      
      if (err.code === 'auth/email-already-in-use') {
        mensagem = '❌ Este e-mail já está registrado!';
      } else if (err.code === 'auth/invalid-email') {
        mensagem = '❌ E-mail inválido!';
      } else if (err.code === 'auth/weak-password') {
        mensagem = '❌ Senha muito fraca!';
      }
      
      mostrarMensagem(mensagem, 'erro');
    }
  });
}

// Função auxiliar para mostrar mensagens
function mostrarMensagem(texto, tipo) {
  if (mensagemEl) {
    mensagemEl.textContent = texto;
    mensagemEl.className = `mensagem ${tipo}`;
  }
}

// Validação em tempo real dos campos
const campos = ['nome', 'sobrenome', 'email', 'dia', 'mes', 'ano', 'senha', 'confirmar'];
campos.forEach(id => {
  const input = document.getElementById(id);
  if (input) {
    input.addEventListener('input', function() {
      if (mensagemEl) mensagemEl.style.display = 'none';
    });
  }
});
