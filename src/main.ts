import { ChatController } from "./ChatController";

document.addEventListener("DOMContentLoaded", async () => {
  const chatController = new ChatController();
});

import { v4 as uuidv4 } from "uuid";

type MessageObject = {
  id: string;
  username: string;
  message: string;
};

document.addEventListener("DOMContentLoaded", async () => {
  const chatContainer = document.getElementById("chatContainer");
  const usernameInput = document.getElementById("usernameInput") as HTMLInputElement;
  const messageInput = document.getElementById("messageInput") as HTMLInputElement;
  const sendBtn = document.getElementById("sendBtn");
  const emojiBtn = document.getElementById("emojiBtn");
  const emojiPicker = document.getElementById("emojiPicker");

  if (chatContainer && usernameInput && messageInput && sendBtn && emojiBtn && emojiPicker) {
    const isOwnMessage = (mesObj: MessageObject) => {
      const myIdsStr = localStorage.getItem("myIds");
      const myIds = myIdsStr ? JSON.parse(myIdsStr) : [];
      return myIds.includes(mesObj.id);
    };

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
        .map((messObj: MessageObject) => {
          return isOwnMessage(messObj)
            ? `<div class="message own-message">
                  <div class="message-content">
                      <div class="message-username">${messObj.username}</div>
                      <div class="message-text">${messObj.message}</div>
                      <div class="message-time"></div>
                   </div>
               </div>`
            : `<div class="message">
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
      const id = uuidv4();
      const myidsStr = localStorage.getItem("myIds");
      const myIds = myidsStr ? JSON.parse(myidsStr) : [];
      myIds.push(id);
      localStorage.setItem("myIds", JSON.stringify(myIds));

      await fetch("http://46.101.114.148:3000/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
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

    // Эмоджи функциональность
    const emojiPickerElement = emojiPicker.querySelector("emoji-picker") as any;

    emojiBtn.addEventListener("click", () => {
      const isVisible = emojiPicker.style.display !== "none";
      emojiPicker.style.display = isVisible ? "none" : "block";
    });

    emojiPickerElement.addEventListener("emoji-click", (event: any) => {
      const emoji = event.detail.unicode;
      const cursorPosition = messageInput.selectionStart || 0;
      const textBefore = messageInput.value.substring(0, cursorPosition);
      const textAfter = messageInput.value.substring(cursorPosition);
      messageInput.value = textBefore + emoji + textAfter;
      messageInput.focus();
      messageInput.setSelectionRange(cursorPosition + emoji.length, cursorPosition + emoji.length);
      emojiPicker.style.display = "none";
    });

    // Закрытие панели эмоджи при клике вне её
    document.addEventListener("click", (e) => {
      if (!emojiBtn.contains(e.target as Node) && !emojiPicker.contains(e.target as Node)) {
        emojiPicker.style.display = "none";
      }
    });
  }
});
