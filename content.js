let isActive = true; // Estado global do bot
const chatStates = {}; // Objeto para armazenar o estado do bot para chats específicos

// Função para obter o número de telefone ao abrir um chat
function obterNumeroTelefone() {
    if (!isActive) return; // Verifica se o bot global está ativo e cancela a função se não estiver

    var amieElement = document.querySelector('._amie');
    if (amieElement) {
        amieElement.click();

        setTimeout(function () {
            var phoneNumberElement = document.querySelector('.x1jchvi3.x1fcty0u.x40yjcy');
            if (phoneNumberElement) {
                var phoneNumber = phoneNumberElement.textContent; // Obtém o número de telefone
                console.log('Número de telefone:', phoneNumber);

                localStorage.setItem('numeroTelefoneAtual', phoneNumber);

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
    iframe.style.cssText = 
    `position: absolute;
    width: 25%;
    height: 100%;
    top: 0;
    right: 0;
    z-index: 1000;
    border: none;
    background-color: #fff;`
    ;

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
        isActive = chatStates[chatId] !== false; // Se não estiver armazenado, o padrão é 'true'
    } else {
        isActive = true;
    }
}

// Função para obter o nome do contato da conversa atual
function getChatId() {
    const headerTitle = document.querySelector('header span[dir="auto"]'); // Seletor para o nome do contato
    return headerTitle ? headerTitle.textContent : '...'; // Retorna o nome do contato ou '...'
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
    
    if (iframe) {
        const data = {
            type: 'update',
            isActive: isActive,
            chatTitle: getChatId(),
            phoneNumber: localStorage.getItem('numeroTelefoneAtual')
        };

        iframe.contentWindow.postMessage(data, '*');
    }
    
    if (!isActive && iframe) {
        // Esvazia o iframe se o bot estiver desativado
        iframe.contentWindow.postMessage({ type: 'clear' }, '*');
    }
}

// Função para ativar o bot ao mudar de chat
function activateBotOnChatChange() {
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
            chatStates[chatId] = isActive; // Armazena o estado do bot para o chat atual
        }
        updateIframe(); // Atualiza o iframe com o estado atual do bot

        if (!isActive) {
            // Se o bot estiver desativado, pare as funções
            console.log("Bot está OFF. Todas as funções foram desativadas.");
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

// Inicialização ao carregar a página
window.addEventListener('load', () => {
    obterNumeroTelefone();
    injectIframe();
    updateIframe();
    startChatObserver();
});