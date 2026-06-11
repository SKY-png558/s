// ====================================
// GERENCIADOR DE CARRINHO
// ====================================

class CarrinhoManager {
    constructor() {
        this.carrinho = this.carregarDoLocalStorage();
        this.inicializarEventos();
    }

    // Carregar carrinho do localStorage
    carregarDoLocalStorage() {
        const dados = localStorage.getItem('carrinho_samsung');
        return dados ? JSON.parse(dados) : [];
    }

    // Salvar carrinho no localStorage
    salvarNoLocalStorage() {
        localStorage.setItem('carrinho_samsung', JSON.stringify(this.carrinho));
    }

    // Adicionar produto ao carrinho
    adicionarProduto(id, nome, preco, imagem) {
        const produtoExistente = this.carrinho.find(p => p.id === id);

        if (produtoExistente) {
            // Se já existe, aumenta a quantidade
            produtoExistente.quantidade += 1;
        } else {
            // Se não existe, cria um novo
            this.carrinho.push({
                id: id,
                nome: nome,
                preco: parseFloat(preco),
                imagem: imagem,
                quantidade: 1
            });
        }

        this.salvarNoLocalStorage();
        this.mostrarNotificacao(`${nome} adicionado ao carrinho!`);
        this.atualizarContadorCarrinho();
    }

    // Remover produto do carrinho
    removerProduto(id) {
        this.carrinho = this.carrinho.filter(p => p.id !== id);
        this.salvarNoLocalStorage();
        this.atualizarCarrinho();
    }

    // Atualizar quantidade
    atualizarQuantidade(id, quantidade) {
        const produto = this.carrinho.find(p => p.id === id);
        if (produto) {
            if (quantidade <= 0) {
                this.removerProduto(id);
            } else {
                produto.quantidade = quantidade;
                this.salvarNoLocalStorage();
                this.atualizarCarrinho();
            }
        }
    }

    // Limpar carrinho
    limparCarrinho() {
        this.carrinho = [];
        this.salvarNoLocalStorage();
        this.atualizarCarrinho();
    }

    // Calcular total
    calcularTotal() {
        return this.carrinho.reduce((total, produto) => {
            return total + (produto.preco * produto.quantidade);
        }, 0);
    }

    // Atualizar contador do carrinho no header
    atualizarContadorCarrinho() {
        const contador = document.querySelector('.contador-carrinho');
        if (contador) {
            const total = this.carrinho.reduce((sum, p) => sum + p.quantidade, 0);
            contador.textContent = total;
            contador.style.display = total > 0 ? 'block' : 'none';
        }
    }

    // Mostrar notificação
    mostrarNotificacao(mensagem) {
        // Remove notificação anterior se existir
        const notificacaoAntiga = document.querySelector('.notificacao');
        if (notificacaoAntiga) notificacaoAntiga.remove();

        const notificacao = document.createElement('div');
        notificacao.className = 'notificacao';
        notificacao.textContent = mensagem;
        notificacao.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notificacao);

        // Auto remover após 3 segundos
        setTimeout(() => {
            notificacao.remove();
        }, 3000);
    }

    // Inicializar eventos dos botões de carrinho
    inicializarEventos() {
        const botoesAdicionar = document.querySelectorAll('.btn-adicionar');

        botoesAdicionar.forEach(botao => {
            botao.addEventListener('click', (e) => {
                const id = botao.dataset.id;
                const nome = botao.dataset.nome;
                const preco = botao.dataset.preco;
                const imagem = botao.dataset.imagem || 'Imagens/default.png';

                this.adicionarProduto(id, nome, preco, imagem);
            });
        });

        // Inicializar página do carrinho se estiver nela
        if (document.querySelector('.carrinho-itens')) {
            this.atualizarCarrinho();
        }

        this.atualizarContadorCarrinho();
    }

    // Atualizar exibição do carrinho
    atualizarCarrinho() {
        const container = document.querySelector('.carrinho-itens');
        if (!container) return;

        if (this.carrinho.length === 0) {
            container.innerHTML = `
                <div class="carrinho-vazio">
                    <div class="cart-icon">🛒</div>
                    <h2>Seu carrinho está vazio.</h2>
                    <p>Volte e adicione alguns produtos!</p>
                    <a href="index.html" class="btn" style="margin-top: 20px;">Continuar Comprando</a>
                </div>
            `;
            document.querySelector('.resumo-carrinho').style.display = 'none';
            return;
        }

        let html = '<table class="tabela-carrinho"><thead><tr><th>Produto</th><th>Preço</th><th>Quantidade</th><th>Subtotal</th><th>Ação</th></tr></thead><tbody>';

        this.carrinho.forEach(produto => {
            const subtotal = produto.preco * produto.quantidade;
            html += `
                <tr class="item-carrinho" data-id="${produto.id}">
                    <td>
                        <div class="produto-info">
                            <img src="${produto.imagem}" alt="${produto.nome}">
                            <span>${produto.nome}</span>
                        </div>
                    </td>
                    <td>R$ ${produto.preco.toFixed(2).replace('.', ',')}</td>
                    <td>
                        <div class="quantidade-controle">
                            <button class="btn-qtd" onclick="carrinhoManager.atualizarQuantidade('${produto.id}', ${produto.quantidade - 1})">-</button>
                            <input type="number" value="${produto.quantidade}" min="1" class="qtd-input" 
                                   onchange="carrinhoManager.atualizarQuantidade('${produto.id}', this.value)">
                            <button class="btn-qtd" onclick="carrinhoManager.atualizarQuantidade('${produto.id}', ${produto.quantidade + 1})">+</button>
                        </div>
                    </td>
                    <td>R$ ${subtotal.toFixed(2).replace('.', ',')}</td>
                    <td>
                        <button class="btn-remover" onclick="carrinhoManager.removerProduto('${produto.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        container.innerHTML = html;

        // Mostrar resumo
        this.atualizarResumo();
        document.querySelector('.resumo-carrinho').style.display = 'block';
    }

    // Atualizar resumo do carrinho
    atualizarResumo() {
        const resumo = document.querySelector('.resumo-carrinho');
        if (!resumo) return;

        const total = this.calcularTotal();
        const quantidade = this.carrinho.reduce((sum, p) => sum + p.quantidade, 0);

        resumo.innerHTML = `
            <h3>Resumo do Carrinho</h3>
            <div class="resumo-item">
                <span>Quantidade de itens:</span>
                <strong>${quantidade}</strong>
            </div>
            <div class="resumo-item">
                <span>Subtotal:</span>
                <strong>R$ ${total.toFixed(2).replace('.', ',')}</strong>
            </div>
            <div class="resumo-item">
                <span>Frete:</span>
                <strong style="color: #28a745;">GRÁTIS</strong>
            </div>
            <div class="resumo-total">
                <span>Total:</span>
                <strong>R$ ${total.toFixed(2).replace('.', ',')}</strong>
            </div>
            <button class="btn-comprar" onclick="alert('Funcionalidade de compra será implementada em breve!')">
                Finalizar Compra
            </button>
            <button class="btn-limpar" onclick="carrinhoManager.limparCarrinho()">
                Limpar Carrinho
            </button>
        `;
    }
}

// Criar instância global
let carrinhoManager;

// Inicializar quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    carrinhoManager = new CarrinhoManager();
});

// Animação de notificação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
