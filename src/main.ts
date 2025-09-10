document.addEventListener("DOMContentLoaded", () => {
  const chatContainer = document.getElementById("chatContainer");
  const usernameInput = document.getElementById("usernameInput");
  const messageInput = document.getElementById("messageInput");
  const sendBtn = document.getElementById("sendBtn");

  if (chatContainer && usernameInput && messageInput && sendBtn) {
    setInterval(async () => {
      const res = await fetch("http://46.101.114.148:3000/chat/messages");
      const json = await res.json();
    }, 1000);
  }
});
