// ====================================
// AUTENTICAÇÃO - PERFIL DO USUÁRIO (SHOW)
// ====================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

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

const loadingEl = document.getElementById('loading');
const conteudoEl = document.getElementById('conteudo');
const erroEl = document.getElementById('erro');

// Verificar se o usuário está autenticado
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Usuário logado - carregar dados
    await carregarDadosUsuario(user);
  } else {
    // Usuário não logado - redirecionar
    mostrarErro('Você precisa fazer login para acessar esta página');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
  }
});

// Carregar dados do usuário
async function carregarDadosUsuario(user) {
  try {
    // Dados básicos do Firebase Auth
    const nomeUsuario = user.displayName || user.email;
    document.getElementById('nomeUsuario').textContent = nomeUsuario;
    document.getElementById('emailUsuario').textContent = user.email;

    // Buscar dados adicionais no Firestore
    const docRef = doc(db, 'usuarios', user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const dados = docSnap.data();

      // Preencher informações do usuário
      document.getElementById('infoNome').textContent = dados.nomeCompleto || '-';
      document.getElementById('infoEmail').textContent = dados.email || '-';
      document.getElementById('infoTelefone').textContent = dados.telefone || 'Não informado';
      document.getElementById('infoData').textContent = dados.dataNascimento || '-';

      // Preencher configurações
      document.getElementById('notificacoes').checked = dados.notificacoes !== false;
      document.getElementById('newsletter').checked = dados.newsletter !== false;
      document.getElementById('publicidade').checked = dados.publicidade || false;

      // Carregar histórico de compras
      carregarHistoricoCompras();
      
      // Carregar wishlist
      carregarWishlist();
    }

    // Mostrar conteúdo e esconder loading
    if (loadingEl) loadingEl.style.display = 'none';
    if (conteudoEl) conteudoEl.style.display = 'block';

  } catch (err) {
    console.error('Erro ao carregar dados:', err);
    mostrarErro('Erro ao carregar seus dados');
  }
}

// Função de logout
window.fazerLogout = async function() {
  if (confirm('Você tem certeza que deseja sair?')) {
    try {
      await signOut(auth);
      localStorage.removeItem('userLogged');
      window.location.href = 'login.html';
    } catch (err) {
      alert('Erro ao fazer logout: ' + err.message);
    }
  }
};

// Habilitar edição de dados
window.habilitarEdicao = function() {
  alert('Função de edição em desenvolvimento!');
};

// Salvar configurações
window.salvarConfiguracoes = async function() {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const notificacoes = document.getElementById('notificacoes').checked;
    const newsletter = document.getElementById('newsletter').checked;
    const publicidade = document.getElementById('publicidade').checked;

    await updateDoc(doc(db, 'usuarios', user.uid), {
      notificacoes,
      newsletter,
      publicidade
    });

    alert('✅ Configurações salvas com sucesso!');
  } catch (err) {
    alert('❌ Erro ao salvar configurações: ' + err.message);
  }
};

// Alterar senha
window.alterarSenha = function() {
  alert('Função de alteração de senha em desenvolvimento!');
};

// Deletar conta
window.deletarConta = function() {
  if (confirm('Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita!')) {
    alert('Função de deleção de conta em desenvolvimento!');
  }
};

// Carregar histórico de compras
function carregarHistoricoCompras() {
  const historicoEl = document.getElementById('historicoCompras');
  
  // Exemplo de dados simulados
  const compras = [
    { nome: 'Galaxy S25', preco: 'R$ 4.999,00', data: '15/06/2026' },
    { nome: 'Monitor 27" 4K', preco: 'R$ 1.299,00', data: '10/06/2026' }
  ];

  if (compras.length > 0) {
    historicoEl.innerHTML = compras.map(compra => `
      <div class="compra-item">
        <div class="compra-info">
          <h4>${compra.nome}</h4>
          <p>${compra.data}</p>
        </div>
        <div class="compra-preco">${compra.preco}</div>
      </div>
    `).join('');
  }
}

// Carregar wishlist
function carregarWishlist() {
  const wishlistEl = document.getElementById('wishlist');
  
  // Exemplo de dados simulados
  const itens = [
    { nome: 'TV QLED 65"', preco: 'R$ 8.999,00' },
    { nome: 'Fone Samsung Galaxy Buds', preco: 'R$ 899,00' }
  ];

  if (itens.length > 0) {
    wishlistEl.innerHTML = itens.map(item => `
      <div class="wishlist-item">
        <div class="wishlist-info">
          <h4>${item.nome}</h4>
        </div>
        <div class="wishlist-preco">${item.preco}</div>
      </div>
    `).join('');
  }
}

// Mostrar erro
function mostrarErro(mensagem) {
  if (loadingEl) loadingEl.style.display = 'none';
  if (conteudoEl) conteudoEl.style.display = 'none';
  if (erroEl) {
    erroEl.style.display = 'block';
    document.getElementById('erroMsg').textContent = mensagem;
  }
}
