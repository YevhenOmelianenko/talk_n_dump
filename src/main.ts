document.addEventListener("DOMContentLoaded", () => {
  const chatContainer = document.getElementById("chatContainer");
  const usernameInput = document.getElementById("usernameInput") as HTMLInputElement;
  const messageInput = document.getElementById("messageInput") as HTMLInputElement;
  const sendBtn = document.getElementById("sendBtn");

  if (chatContainer && usernameInput && messageInput && sendBtn) {
    setInterval(async () => {
      const res = await fetch("http://46.101.114.148:3000/chat/messages");
      const json = await res.json();
      chatContainer.innerHTML = json
        .map((messObj: any) => {
          return `<div class="message">
        <div class="message-content">
            <div class="message-username">${messObj.username}</div>
            <div class="message-text">${messObj.message}</div>
            <div class="message-time">12:35</div>
        </div>
    </div>`;
        })
        .join("\n");
    }, 1000);

    sendBtn.addEventListener("click", async () => {
      await fetch("http://46.101.114.148:3000/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: "temporary-id-1",
          username: usernameInput.value,
          message: messageInput.value,
        }),
      });
    });
  }
});
