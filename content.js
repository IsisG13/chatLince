// content.js

let isActive = true; // Estado inicial do bot

// Função para injetar o iframe
function injectIframe() {
    const existingIframe = document.getElementById('my-custom-iframe');
    if (existingIframe) return existingIframe; // Evita injetar múltiplos iframes

    const appElement = document.getElementById('app');
    if (appElement) {
        appElement.style.width = '75%'; // Ajusta a largura do aplicativo
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'my-custom-iframe';
    iframe.src = chrome.runtime.getURL('iframe.html'); // Define a fonte do iframe
    iframe.style.width = '25%';
    iframe.style.height = '100%';
    iframe.style.background = 'white';
    iframe.style.zIndex = '2000';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.top = '0';
    iframe.style.border = 'none';
    iframe.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
    document.body.appendChild(iframe); // Adiciona o iframe ao corpo do documento

    return iframe;
}

// Função para adicionar/remover eventos de mouse em mensagens  
function addMouseListeners() {
    const messages = document.querySelectorAll('div.message-in, div.message-out');

    messages.forEach(message => {
        message.addEventListener('mouseover', () => {
            if (isActive) {
                observer.disconnect(); // Desconecta o observador ao passar o mouse  
            }
        });

        message.addEventListener('mouseout', () => {
            if (isActive) {
                observer.observe(document.body, { childList: true, subtree: true }); // Reativa a observação  
            }
        });
    });
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
    const headerTitle = document.querySelector('header span[dir="auto"]'); // Seletor para o nome do contato
    return headerTitle ? headerTitle.textContent : '...'; // Retorna o nome do contato ou '...'
}

// Função para obter a última mensagem da conversa atual
function getLastMessage() {
    const messages = document.querySelectorAll('div.message-in, div.message-out');
    if (messages.length === 0) return '...';

    const lastMessage = messages[messages.length - 1];
    const messageText = lastMessage.querySelector('span.selectable-text');
    return messageText ? messageText.innerText : '...';
}

// Função para atualizar o iframe com as informações atuais
function updateIframe() {
    const iframe = document.getElementById('my-custom-iframe');
    if (!iframe) return;

    const data = {
        type: 'update',
        isActive: isActive,
        chatTitle: getChatId(),
        lastMessage: getLastMessage()
    };

    iframe.contentWindow.postMessage(data, '*');
}

// Função para ativar o bot ao mudar de chat
function activateBotOnChatChange() {
    isActive = true;
    checkBotState();
    updateIframe();
}

// Observador para detectar mudanças de chat
const chatObserver = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            // Aguarda um pequeno intervalo para garantir que o DOM foi atualizado
            setTimeout(() => {
                activateBotOnChatChange();
            }, 1000); // 1 segundo de delay
            break;
        }
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

// Observador para detectar novas mensagens no chat atual
const messageObserver = new MutationObserver((mutationsList, observer) => {
    if (!isActive) return;

    for (let mutation of mutationsList) {
        if (mutation.addedNodes.length > 0) {
            // Aqui você pode adicionar a lógica do bot para processar novas mensagens
            console.log('Nova mensagem recebida:', getLastMessage());
            updateIframe();
            break;
        }
    }
});

// Iniciar observação de novas mensagens
function startMessageObserver() {
    const chatContainer = document.querySelector('div.copyable-area');
    if (chatContainer) {
        const messagesContainer = chatContainer.querySelector('div[role="region"]');
        if (messagesContainer) {
            messageObserver.observe(messagesContainer, { childList: true, subtree: true });
        } else {
            setTimeout(startMessageObserver, 1000);
        }
    } else {
        setTimeout(startMessageObserver, 1000);
    }
}

// Inicialização ao carregar a página
window.addEventListener('load', () => {
    injectIframe();
    updateIframe();
    startChatObserver();
    startMessageObserver();
    
    // Chamar a função para adicionar eventos de mouse  
    addMouseListeners();
});
