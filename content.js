let iframe;
let lastPhoneNumber = "";

function injectIframe(phoneNumber) {
  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    const container = document.querySelector('#side');
    container.appendChild(iframe);
  }
  iframe.src = `http://localhost/iframe.php?phone=${phoneNumber}`;
}

function getPhoneNumber() {
  const chatTitle = document.querySelector("#main header span[title]");
  return chatTitle ? chatTitle.innerText : null;
}

function monitorConversationChanges() {
  const observer = new MutationObserver(() => {
    const phoneNumber = getPhoneNumber();
    if (phoneNumber && phoneNumber !== lastPhoneNumber) {
      injectIframe(phoneNumber);
      lastPhoneNumber = phoneNumber;
    }
  });

  const chatArea = document.querySelector("#main");
  observer.observe(chatArea, { childList: true, subtree: true });
}

function addToggleButton() {
  const button = document.createElement("button");
  button.id = "toggleBot";
  button.innerText = "ON/OFF";
  button.addEventListener("click", () => {
    const isActive = button.classList.toggle("active");
    chrome.storage.local.set({ botActive: isActive });
    // Lógica para desativar o bot pode ser colocada aqui
  });

  const container = document.querySelector('#side');
  container.appendChild(button);
}

chrome.storage.local.get(["botActive"], (result) => {
  if (result.botActive) {
    addToggleButton();
    monitorConversationChanges();
  }
});
