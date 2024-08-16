let currentChatId = null; // Armazenar o ID da conversa atual  
const iframeId = "custom_iframe";  
const iframeSrc = chrome.runtime.getURL("iframe.html");  

function addIframe() {  
  if (document.getElementById(iframeId)) return; // Evitar múltiplas inserções  

  const iframe = document.createElement("iframe");  
  iframe.id = iframeId;  
  iframe.style.width = "300px"; // Defina a largura do iframe  
  iframe.style.height = "100%"; // Defina a altura do iframe  
  iframe.style.position = "fixed";  
  iframe.style.right = "0";  
  iframe.style.top = "0";  
  iframe.style.zIndex = "1000";  
  iframe.style.background = "white";  
  iframe.src = iframeSrc;  

  document.body.appendChild(iframe);  
}  

function getCurrentChatId() {  
  const chatElement = document.querySelector("div[data-testid='cell-frame']");  
  if (chatElement) {  
    return chatElement.dataset.id; // Ajuste isso para o ID real da conversa  
  }  
  return null;  
}  

function monitorChatChanges() {  
  const chatObserver = new MutationObserver(() => {  
    const newChatId = getCurrentChatId();  
    if (newChatId && newChatId !== currentChatId) {  
      currentChatId = newChatId;  
      // Realizar a requisição AJAX como necessário  
      fetch(`iframe.php?phone=${currentChatId}`) // Altere para sua URL PHP  
        .then(response => response.text())  
        .then(data => {  
          const iframe = document.getElementById(iframeId);  
          if (iframe) {  
            iframe.contentWindow.postMessage({ phone: currentChatId, content: data }, "*");  
          }  
        })  
        .catch(error => console.error("Erro ao buscar dados:", error)); // Tratamento de erro  
    }  
  });  

  const chatContainer = document.querySelector("div[data-testid='chat-list']");  
  if (chatContainer) {  
    chatObserver.observe(chatContainer, { childList: true, subtree: true });  
  }  
}  

window.onload = function() {  
  addIframe();  
  monitorChatChanges();  
};