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
      iframe.style.border = 'none';
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
    return headerTitle ? headerTitle.textContent : 'Selecione algum contato';
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
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    } else {
      console.error("Iframe não foi injetado!");
    }
  });
  