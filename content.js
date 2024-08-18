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
    console.log("iframe", iframe)
    document.body.appendChild(iframe); // Injeta o iframe diretamente no body

    return iframe;
}

// Função para atualizar o iframe
function updateIframe(iframe) {
    const phoneNumber = getPhoneNumber();
    console.log("phoneNumber", phoneNumber)
    if (phoneNumber) {
        iframe.src = chrome.runtime.getURL(`iframe.html?phone=${encodeURIComponent(phoneNumber)}`);
    }
}

// Função para obter o número de telefone da conversa atual
function getPhoneNumber() {
    const headerTitle = document.querySelector('header span[dir="auto"]'); // Seletor para o nome do contato
    return headerTitle ? headerTitle.textContent : '...';
}

// Função para criar o botão ON/OFF
function createToggleButton() {
    const button = document.createElement('button');
    button.textContent = 'Bot: ON';
    button.classList.add('toggle-button');
    button.addEventListener('click', () => {
        const isOn = button.textContent === 'Bot: ON';
        button.textContent = isOn ? 'Bot: OFF' : 'Bot: ON';
        // Aqui você pode adicionar a lógica para ativar/desativar o bot
    });
    return button;
}

// Observador de mutações para detectar mudanças na conversa
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.type === 'childList' || mutation.type === 'subtree') {
            const iframe = document.querySelector('iframe');
            if (iframe) {
                updateIframe(iframe);
            }
        }
    }
});

// Inicialização
window.addEventListener('load', () => {
    const iframe = injectIframe();
    if (iframe) {
        updateIframe(iframe);
        const toggleButton = createToggleButton();
        iframe.parentNode.insertBefore(toggleButton, iframe);

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    } else {
        console.error("Iframe não foi injetado!");
    }
});
