// Função para injetar o iframe
function injectIframe() {
    const rightColumn = document.querySelector('._3QfZd');
    if (rightColumn) {
    const iframe = document.createElement('iframe');
    iframe.src = chrome.runtime.getURL('iframe.html');
    iframe.style.width = '100%';
    iframe.style.height = '300px';
    iframe.style.border = 'none';
    rightColumn.prepend(iframe);
    return iframe;
    }
    return null;
   }
   
   // Função para atualizar o iframe
   function updateIframe(iframe) {
    const phoneNumber = getPhoneNumber();
    if (phoneNumber) {
    iframe.src = `iframe.html?phone=${encodeURIComponent(phoneNumber)}`;
    }
   }
   
   // Função para obter o número de telefone da conversa atual
   function getPhoneNumber() {
    const headerTitle = document.querySelector('._21nHd');
    return headerTitle ? headerTitle.textContent : null;
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
    }
   });