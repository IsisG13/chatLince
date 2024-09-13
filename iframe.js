// IFRAME.JS

let isActive = false;

document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggle-button');

    toggleButton.addEventListener('change', () => {
        isActive = toggleButton.checked;
        updateUI({ isActive: isActive, chatTitle: document.getElementById('chat-title').textContent });
        window.parent.postMessage({ type: 'toggle', isActive: isActive }, '*');
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

    if (data.phoneNumber) {
        phoneNumberElement.textContent = data.phoneNumber;
        phoneNumberElement.style.display = 'block';
    } else {
        phoneNumberElement.style.display = 'none';
    }

    toggleButton.checked = isActive;

    carregarDados(data.phoneNumber);
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

        window.parent.postMessage({ type: 'update', isActive: true, chatTitle: 'Nome do Contato' }, '*');
    } else {
        errorMessage.style.display = 'block';
    }
}

// Função de validação do token  
function validateToken(token) {
    // Valida o token (aqui você pode definir a lógica real para a validação)
    return token === 'lincedelivery_1234';
}

async function carregarDados(telefone) {
    try {
        const response = await fetch('clientes.json');
        const data = await response.json();

        const contato = data.usuarios.find(usuario => usuario.numero_telefone === telefone);

        if (contato) {
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

            document.getElementById('dados-usuarios').style.display = 'block';
            document.querySelector('.status').innerText = '';
        } else {
            document.querySelector('.status').innerText = 'Cliente não cadastrado!';
            document.getElementById('dados-usuarios').style.display = 'block';
            
            // Limpa os campos quando o cliente não é encontrado
            ['nome', 'email', 'numero_telefone', 'ano_inicio_cliente', 'data', 'hora', 'endereco', 'preco', 'pedido', 'precoPedido'].forEach(id => {
                document.getElementById(id).innerText = '';
            });
        }
    } catch (error) {
        console.error('Erro ao carregar dados JSON:', error);
    }
}

// Chama a função ao carregar a página
window.addEventListener('load', () => {
    const submitTokenButton = document.getElementById('submit-token');
    submitTokenButton.addEventListener('click', handleTokenSubmit);
});

// Listener para mensagens recebidas do content script  
window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'update') {
        updateUI(event.data);
    }
});