// IFRAME.JS
let isActive = false;

document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggle-button');
    const toggleButton2 = document.getElementById('toggle-button2');

    toggleButton.addEventListener('change', () => {
        isActive = toggleButton.checked;
        updateUI({ isActive: isActive, chatTitle: document.getElementById('chat-title').textContent });
        window.parent.postMessage({ type: 'toggle', isActive: isActive }, '*');
    });

    toggleButton2.addEventListener('change', () => {
        const specificBotState = toggleButton2.checked;
        updateUI({ isActive: specificBotState, chatTitle: document.getElementById('chat-title').textContent });
        window.parent.postMessage({ type: 'toggle', isActive: specificBotState }, '*');
    });
});

function updateUI(data) {
    const statusIndicator = document.getElementById('status-indicator');
    const chatTitleElement = document.getElementById('chat-title');
    const phoneNumberElement = document.getElementById('phone-number');
    const toggleButton = document.getElementById('toggle-button');
    const toggleButton2 = document.getElementById('toggle-button2');

    isActive = data.isActive;

    // Se o bot estiver desativado, limpar o conteúdo do iframe
    if (!isActive) {
        clearIframeContent();
        return;
    }

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
    toggleButton2.checked = isActive;

    carregarDados(data.phoneNumber);
}

// Função para limpar o conteúdo do iframe
function clearIframeContent() {
    document.getElementById('status-indicator').textContent = '';
    document.getElementById('chat-title').textContent = '';
    document.getElementById('phone-number').textContent = '';
    document.getElementById('dados-usuarios').style.display = 'none';
    document.querySelector('.status').innerText = '';
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
        document.getElementById('img').style.display = 'block';
        document.getElementById('img2').style.display = 'block';
        document.getElementById('img3').style.display = 'block';

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
    if (!isActive || !telefone) return; // Se o bot estiver desativado, não faz nada

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
            document.getElementById('data2').innerText = contato.data2;
            document.getElementById('data3').innerText = contato.data3;

            document.getElementById('hora').innerText = contato.hora;
            document.getElementById('hora2').innerText = contato.hora2;
            document.getElementById('hora3').innerText = contato.hora3;

            document.getElementById('endereco').innerText = contato.endereco;
            document.getElementById('endereco2').innerText = contato.endereco2;
            document.getElementById('endereco3').innerText = contato.endereco3;

            document.getElementById('preco').innerText = contato.preco;
            document.getElementById('preco2').innerText = contato.preco2;
            document.getElementById('preco3').innerText = contato.preco3;

            document.getElementById('pedido').innerText = contato.pedido;
            document.getElementById('pedido2').innerText = contato.pedido2;
            document.getElementById('pedido3').innerText = contato.pedido3;

            document.getElementById('precoPedido').innerText = contato.precoPedido;
            document.getElementById('precoPedido2').innerText = contato.precoPedido2;
            document.getElementById('precoPedido3').innerText = contato.precoPedido3;

            document.getElementById('img').src = contato.img;
            document.getElementById('img2').src = contato.img2;
            document.getElementById('img3').src = contato.img3;

            document.getElementById('dados-usuarios').style.display = 'block';
            document.querySelector('.status').innerText = '';
        } else {
            document.querySelector('.status').innerText = 'Cliente não cadastrado!';
            document.getElementById('dados-usuarios').style.display = 'block';

            // Limpa os campos quando o cliente não é encontrado
            ['nome', 'email', 'numero_telefone', 'ano_inicio_cliente', 'data', 'hora', 'endereco', 'preco', 'pedido', 'precoPedido', 'img', 
             'data2', 'hora2', 'endereco2', 'preco2', 'pedido2', 'precoPedido2', 'img2', 
             'data3', 'hora3', 'endereco3', 'preco3', 'pedido3', 'precoPedido3', 'img3'].forEach(id => {
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
// Escuta mensagens vindas do conteúdo
window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'update') {
        updateUI(event.data);
    } else if (event.data && event.data.type === 'clear') {
        clearIframeContent();
    }
});