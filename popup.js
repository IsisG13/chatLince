document.getElementById("toggleBot").addEventListener("click", () => {
    chrome.storage.local.get(["botActive"], (result) => {
      const isActive = !result.botActive;
      chrome.storage.local.set({ botActive: isActive });
      alert(isActive ? "Bot ativado" : "Bot desativado");
    });
  });
  