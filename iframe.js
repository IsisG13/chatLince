// IFRAME.JS

let isActive = false;

document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggle-button');

    toggleButton.addEventListener('change', () => {
        isActive = toggleButton.checked; // Define o estado com base no checkbox
        updateUI({ isActive: isActive, chatTitle: document.getElementById('chat-title').textContent });
        window.parent.postMessage({ type: 'toggle', isActive: isActive }, '*');

        carregarDados(); // Carrega os dados JSON assim que o documento estiver pronto
    });
});

function updateUI(data) {
    const statusIndicator = document.getElementById('status-indicator');
    const chatTitleElement = document.getElementById('chat-title');
    const phoneNumberElement = document.getElementById('phone-number');
    const toggleButton = document.getElementById('toggle-button');

    isActive = data.isActive;

    statusIndicator.textContent = isActive ? 'Bot ON' : `Bot desativado para: ${data.chatTitle}`;
    statusIndicator.style.color = isActive ? 'green' : 'red';

    chatTitleElement.textContent = isActive ? data.chatTitle || '...' : '';

    // Atualiza o número de telefone, se fornecido
    if (data.phoneNumber) {
        phoneNumberElement.textContent = data.phoneNumber;
        phoneNumberElement.style.display = 'block'; // Torna o número de telefone visível
    } else {
        phoneNumberElement.style.display = 'none'; // Esconde se não houver número
    }

    toggleButton.checked = isActive; // Atualiza o estado do toggle switch
}

function toggleBot() {
    isActive = !isActive;
    window.parent.postMessage({ type: 'toggle', isActive: isActive }, '*');
}

function handleTokenSubmit() {
    const tokenInput = document.getElementById('token-input');
    const token = tokenInput.value;
    const errorMessage = document.getElementById('error-message');

    if (validateToken(token)) {
        // Token válido: Oculta a solicitação de token e exibe os elementos necessários
        errorMessage.style.display = 'none';
        document.getElementById('token-request').style.display = 'none';
        document.getElementById('status-indicator').style.display = 'block';
        document.getElementById('chat-info').style.display = 'block';
        document.getElementById('chat-title').style.display = 'block';
        document.getElementById('button').style.display = 'block';
        document.getElementById('button2').style.display = 'block';
        document.getElementById('conteudo-contato').style.display = 'block';
        document.getElementById('HR').style.display = 'block';
        document.getElementById('Hr').style.display = 'block';
        document.getElementById('hr').style.display = 'block';
        document.getElementById('pPedidos').style.display = 'block';
        document.getElementById('pBot').style.display = 'block';
        document.getElementById('pBot2').style.display = 'block';
        document.getElementById('pPedidos').style.display = 'block';
        document.getElementById('pItens').style.display = 'block';
        document.getElementById('dados-usuarios').style.display = 'block';

        // Envia uma mensagem para o content script que o token foi validado
        window.parent.postMessage({ type: 'update', isActive: true, chatTitle: 'Nome do Contato' }, '*');
    } else {
        // Token inválido: exibe a mensagem de erro
        errorMessage.style.display = 'block';
    }
}

// Função de validação do token  
function validateToken(token) {
    // Valida o token (aqui você pode definir a lógica real para a validação)
    return token === 'lincedelivery_1234';
}

async function carregarDados() {
    try {
        // Faz a requisição para carregar o JSON
        const response = await fetch('clientes.json');
        const data = await response.json();

        // Obtém o número de telefone armazenado no localStorage
        const telefone = localStorage.getItem('numeroTelefoneAtual');

        // Encontra o contato correspondente no JSON
        const contato = data.usuarios.find(usuario => usuario.numero_telefone === telefone);

        if (contato) {
            // Preenche os dados no HTML
            document.getElementById('nome').innerText = contato.nome;
            document.getElementById('email').innerText = contato.email;
            document.getElementById('numero_telefone').innerText = contato.numero_telefone;
            document.getElementById('ano_inicio_cliente').innerText = contato.ano_inicio_cliente;
            document.getElementById('data').innerText = contato.data;
            document.getElementById('hora').innerText = contato.hora;
            document.getElementById('endereco').innerText = contato.endereco;
            document.getElementById('preco').innerText = contato.preco;
            document.getElementById('pedido').innerText = contato.pedido;
            document.getElementById('precoPedido').innerText = contato.precoPedido;

            // Exibe o conteúdo de contato
            document.getElementById('dados-usuarios').style.display = 'block';
        } else {
            // Se o contato não for encontrado, esconde o conteúdo
            document.getElementById('dados-usuarios').style.display = 'none';
        }
    } catch (error) {
        console.error('Erro ao carregar dados JSON:', error);
    }
}

// Chama a função ao carregar a página
window.addEventListener('load', () => {
    carregarDados();

    const submitTokenButton = document.getElementById('submit-token');
    submitTokenButton.addEventListener('click', handleTokenSubmit);
});


// Listener para o botão de envio do token  
window.addEventListener('load', () => {
    const toggleButton = document.getElementById('toggle-button');
    toggleButton.addEventListener('click', toggleBot);

    const submitTokenButton = document.getElementById('submit-token');
    submitTokenButton.addEventListener('click', handleTokenSubmit);
});

// Listener para mensagens recebidas do content script  
window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'update') {
        updateUI(event.data);
    }
});
