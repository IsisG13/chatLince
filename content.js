let isActive = true; // Estado inicial do botão

// Função para injetar o iframe
function injectIframe() {
    const iframe = document.createElement('iframe');
    iframe.src = chrome.runtime.getURL('iframe.html');
    iframe.style.width = '39%';
    iframe.style.height = '110';
    iframe.style.background = 'white';
    iframe.style.zIndex = '2000';
    iframe.style.position = 'absolute';
    iframe.style.left = '60%';
    iframe.style.top = '7%';
    iframe.style.border = '1px solid black';
    document.body.appendChild(iframe); // Injeta o iframe diretamente no body

    return iframe;
}

function getLastMessage() {
    const messages = document.querySelectorAll('div.message-in, div.message-out');
    const lastMessage = messages[messages.length - 1];
    const messageElement = lastMessage ? lastMessage.querySelector('div.copyable-text') : null;
    return messageElement ? messageElement.textContent.trim() : '...';
}

function updateIframe(iframe) {
    const phoneNumber = getPhoneNumber();
    const lastMessage = getLastMessage();
    if (phoneNumber) {
        iframe.src = chrome.runtime.getURL(`iframe.html?phone=${encodeURIComponent(phoneNumber)}&message=${encodeURIComponent(lastMessage)}`);
    }
}

// Função para obter o número de telefone da conversa atual
function getPhoneNumber() {
    const headerTitle = document.querySelector('header span[dir="auto"]'); // Seletor para o nome do contato
    return headerTitle ? headerTitle.textContent : '...';
}

// Adicione um MutationObserver para atualizar o iframe quando novas mensagens são recebidas
const observer = new MutationObserver((mutations) => {
    if (isActive) { // Verifica se o botão está ativado
        for (const mutation of mutations) {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                const iframe = document.querySelector('iframe');
                if (iframe) {
                    updateIframe(iframe);
                }
            }
        }
    }
});

// Inicialização
window.addEventListener('load', () => {
    const iframe = injectIframe();
    if (iframe) {
        updateIframe(iframe);

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    } else {
        console.error("Iframe não foi injetado!");
    }
});


// Listener para mensagens do iframe
window.addEventListener('message', (event) => {
    if (event.data.type === 'toggle') {
        isActive = event.data.active;
        if (!isActive) {
            // Parar a observação das mutações
            observer.disconnect();
        } else {
            // Reiniciar a observação das mutações
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }
});