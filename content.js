let currentPhone = null;  

function addIframe() {  
  const iframeId = 'myIframe';  
  const existingIframe = document.getElementById(iframeId);  

  if (existingIframe) {  
    return; // Remove se já existir  
  }  

  const iframe = document.createElement('iframe');  
  iframe.id = iframeId;  
  iframe.style.width = "300px";  
  iframe.style.height = "100%";  
  iframe.style.position = "fixed";  
  iframe.style.right = "0";  
  iframe.style.top = "0";  
  iframe.style.zIndex = "1000";  
  iframe.style.background = "white";  
  iframe.src = chrome.runtime.getURL("iframe.html");  

  document.body.appendChild(iframe);  
}  

function getCurrentChatPhone() {  
  const chatElement = document.querySelector("div[data-testid='cell-frame']");  
  if (chatElement) {  
    const phoneNumber = chatElement.getAttribute('data-testid').split('-')[1]; // Ajuste conforme necessário para pegar o número  
    return phoneNumber; // Retorna o número correspondente  
  }  
  return null;  
}  

function monitorMessages() {  
  const messageObserver = new MutationObserver(() => {  
    const phone = getCurrentChatPhone();  
    if (phone && phone !== currentPhone) {  
      currentPhone = phone;  

      // Aqui você pode fazer uma requisição para atualizar o iframe  
      const iframe = document.getElementById('myIframe');  
      if (iframe) {  
        iframe.contentWindow.postMessage({ phone: currentPhone, message: "Recebi como parâmetro" }, "*");  
      }  
    }  
  });  

  const chatContainer = document.querySelector("div[data-testid='chatlist']");  
  if (chatContainer) {  
    messageObserver.observe(chatContainer, { childList: true, subtree: true });  
  }  
}  

window.onload = function() {  
  addIframe();  
  monitorMessages();  
};