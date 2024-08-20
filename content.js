// CONTENT.JS

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
        iframe.contentWindow.postMessage({
            type: 'update',
            phone: phoneNumber,
            message: lastMessage
        }, '*');
    }
}


// Função para obter o número de telefone da conversa atual
function getPhoneNumber() {
    const headerTitle = document.querySelector('header span[dir="auto"]'); // Seletor para o nome do contato
    return headerTitle ? headerTitle.textContent : '...';
}

// Adapte a função de atualização para adicionar novamente os listeners quando houver uma atualização  
const observer = new MutationObserver((mutations) => {
    console.log("Ativo", isActive)
    if (!isActive) {
        return (
            alert ("Testando comunicação")
        )
    }
    if (isActive) { // Verifica se o botão está ativo
        for (const mutation of mutations) {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                const iframe = document.querySelector('iframe');
                if (iframe) {
                    updateIframe(iframe);
                    addMouseListeners(); // Adiciona os listeners toda vez que o iframe é atualizado  
                }
            }
        }
    }
});


// Função para adicionar/remover eventos de mouse em mensagens  
function addMouseListeners() {
    const messages = document.querySelectorAll('div.message-in, div.message-out');

    messages.forEach(message => {
        message.addEventListener('mouseover', () => {
            if (isActive) {
                observer.disconnect();
            }
        });

        message.addEventListener('mouseout', () => {
            if (isActive) {
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        });
    });
}

// Inicialização  
window.addEventListener('load', () => {
    const iframe = injectIframe();
    if (iframe) {
        updateIframe(iframe);

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Chamar a função para adicionar eventos de mouse  
        addMouseListeners();
    } else {
        console.error("Iframe não foi injetado!");
    }
});


// Listener para mensagens do iframe
window.addEventListener('message', (event) => {
    if (event.data.type === 'toggle') {
        isActive = event.data.active;
        console.log("Estado bot:", isActive); // Adiciona log para depuração
        if (!isActive) {
            observer.disconnect(); // Parar a observação das mutações
        } else {
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }
});
