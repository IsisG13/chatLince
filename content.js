// CONTENT.JS
let isActive = true; // Estado inicial do bot

// Função para obter o número de telefone ao abrir um chat
function obterNumeroTelefone() {
    var amieElement = document.querySelector('._amie');
    if (amieElement) {
        amieElement.click();

        setTimeout(function () {
            var phoneNumberElement = document.querySelector('.x1jchvi3.x1fcty0u.x40yjcy');
            if (phoneNumberElement) {
                var phoneNumber = phoneNumberElement.textContent; // Obtém o número de telefone
                console.log('Número de telefone:', phoneNumber);

                // Salva o número de telefone no localStorage
                localStorage.setItem('numeroTelefoneAtual', phoneNumber);

                // Envia o número de telefone para o iframe
                const iframe = document.getElementById('my-custom-iframe');
                if (iframe) {
                    iframe.contentWindow.postMessage({
                        type: 'update',
                        isActive: isActive,
                        chatTitle: getChatId(),
                        phoneNumber: phoneNumber
                    }, '*');
                }
            } else {
                console.log('Elemento do número de telefone não encontrado.');
            }
        }, 500);
    } else {
        console.log('Elemento com a classe ._amie não encontrado.');
    }
}

// Função para injetar o iframe
function injectIframe() {
    const existingIframe = document.getElementById('my-custom-iframe');
    if (existingIframe) return existingIframe;

    const appElement = document.getElementById('app');
    if (appElement) {
        appElement.style.width = '75%';
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'my-custom-iframe';
    iframe.src = chrome.runtime.getURL('iframe.html');
    iframe.style.cssText = `
        position: absolute;
        width: 25%;
        height: 100%;
        top: 0;
        right: 0;
        z-index: 1000;
        border: none;
        background-color: #fff;
    `;

    iframe.addEventListener('load', function () {
        console.log('iFrame carregado.');
        iframe.contentWindow.postMessage({
            type: 'update',
            isActive: isActive,
            chatTitle: getChatId()
        }, '*');
    });

    document.body.appendChild(iframe);

    return iframe;
}


// Função para verificar o estado do bot com base no chat atual
function checkBotState() {
    const chatId = getChatId();
    if (chatId) {
        const storedState = localStorage.getItem(`botState-${chatId}`);
        isActive = storedState !== 'false'; // Se não estiver armazenado, o padrão é 'true'
    } else {
        isActive = true;
    }
}

// Função para obter o nome do contato da conversa atual
function getChatId() {
    const selectedChat = document.querySelector('.x1lliihq .x1ey2m1c');
    return selectedChat ? selectedChat.textContent.trim() : 'Nome do Contato';
}

setTimeout(() => {
    injectIframe();
}, 2000);

setInterval(() => {
    obterNumeroTelefone();
}, 2000);

// Função para atualizar o iframe com as informações atuais
function updateIframe() {
    const iframe = document.getElementById('my-custom-iframe');
    if (!iframe) return;

    const data = {
        type: 'update',
        isActive: isActive,
        chatTitle: getChatId(),
        phoneNumber: localStorage.getItem('numeroTelefoneAtual')
    };

    iframe.contentWindow.postMessage(data, '*');
}

// Função para ativar o bot ao mudar de chat
function activateBotOnChatChange() {
    isActive = true;
    checkBotState(); // Verifica o estado do bot ao mudar de chat
    updateIframe();
    obterNumeroTelefone(); // Atualiza o número de telefone ao mudar de chat
}

// Observador para detectar mudanças de chat
const chatObserver = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            // Verifica se a mudança é na lista de chats, indicando uma mudança de chat
            if (mutation.target && mutation.target.closest('#pane-side')) {
                // Aguarda um pequeno intervalo para garantir que o DOM foi atualizado
                setTimeout(() => {
                    activateBotOnChatChange();
                }, 1000);
                break;
            }
        }
    }
});

// Listener para mensagens recebidas do iframe
window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'toggle') {
        isActive = event.data.isActive;
        const chatId = getChatId();
        if (chatId) {
            localStorage.setItem(`botState-${chatId}`, isActive); // Armazena o estado do bot para o chat atual
        }
        updateIframe();
    }
});

// Iniciar observação de mudanças no chat
function startChatObserver() {
    const chatList = document.querySelector('#pane-side');
    if (chatList) {
        chatObserver.observe(chatList, { childList: true, subtree: true });
    } else {
        // Tenta novamente após um tempo se o chatList não estiver disponível
        setTimeout(startChatObserver, 1000);
    }
}

// Inicialização ao carregar a página
window.addEventListener('load', () => {
    obterNumeroTelefone();
    injectIframe();
    updateIframe();
    startChatObserver();
});
