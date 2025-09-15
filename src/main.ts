declare const uuidv4: () => string;

document.addEventListener("DOMContentLoaded", async () => {
  const chatContainer = document.getElementById("chatContainer");
  const usernameInput = document.getElementById("usernameInput") as HTMLInputElement;
  const messageInput = document.getElementById("messageInput") as HTMLInputElement;
  const sendBtn = document.getElementById("sendBtn");

  if (chatContainer && usernameInput && messageInput && sendBtn) {
    const hideChatContainer = async () => {
      chatContainer.style.visibility = "hidden";
    };
    const showChatContainer = async () => {
      chatContainer.style.visibility = "visible";
    };

    const isAtDown = () => chatContainer.scrollTop === chatContainer.scrollHeight;
    const scrollToDown = async () => {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    };
    const loadChat = async () => {
      const res = await fetch("http://46.101.114.148:3000/chat/messages");
      const json = await res.json();
      chatContainer.innerHTML = json
        .map((messObj: any) => {
          return `<div class="message">
        <div class="message-content">
            <div class="message-username">${messObj.username}</div>
            <div class="message-text">${messObj.message}</div>
            <div class="message-time"></div>
        </div>
    </div>`;
        })
        .join("\n");

      await new Promise((resolve) => requestAnimationFrame(resolve));

      if (isAtDown()) {
        scrollToDown();
      }
    };
    await hideChatContainer();
    await loadChat();
    await scrollToDown();
    await showChatContainer();
    setInterval(loadChat, 1000);

    const sendMessage = async () => {
      if (!usernameInput.value || !messageInput.value) {
        return;
      }
      await fetch("http://46.101.114.148:3000/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: uuidv4(),
          username: usernameInput.value,
          message: messageInput.value,
        }),
      });
      messageInput.value = "";
      messageInput.focus();
    };

    sendBtn.addEventListener("click", sendMessage);
    messageInput.addEventListener("keyup", async (e) => {
      if (e.key === "Enter") {
        await sendMessage();
      }
    });
  }
});
