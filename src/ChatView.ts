import { MessageObject } from "./models/ChatModel";
export class ChatView {
  private chatContainer;
  private usernameInput;
  private messageInput;
  private sendBtn;
  private emojiBtn;
  private emojiPicker;

  constructor() {
    this.chatContainer = document.getElementById("chatContainer") as HTMLElement;
    this.usernameInput = document.getElementById("usernameInput") as HTMLInputElement;
    this.messageInput = document.getElementById("messageInput") as HTMLInputElement;
    this.sendBtn = document.getElementById("sendBtn") as HTMLElement;
    this.emojiBtn = document.getElementById("emojiBtn") as HTMLElement;
    this.emojiPicker = document.getElementById("emojiPicker") as HTMLElement;

    this.initializeEmojiPicker();
  }

  onReady = (func: () => void) => {
    document.addEventListener("DOMContentLoaded", func);
  };

  hideChatContainer = async () => {
    this.chatContainer.style.visibility = "hidden";
  };
  showChatContainer = async () => {
    this.chatContainer.style.visibility = "visible";
  };

  isAtDown = () => {
    return (
      Math.round(this.chatContainer.scrollTop) + this.chatContainer.clientHeight ===
      Math.round(this.chatContainer.scrollHeight)
    );
  };
  scrollToDown = async () => {
    this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
  };

  private sendMessage = async (func: (message: MessageObject) => void) => {
    if (!this.usernameInput.value || !this.messageInput.value) {
      return;
    }
    func({
      username: this.usernameInput.value,
      message: this.messageInput.value,
    });
    this.messageInput.value = "";
    this.messageInput.focus();
  };

  onSendMessage = (func: (message: MessageObject) => void) => {
    this.sendBtn.addEventListener("click", () => {
      this.sendMessage(func);
    });
    this.messageInput.addEventListener("keyup", async (e) => {
      if (e.key === "Enter") {
        this.sendMessage(func);
      }
    });
  };

  clearMessages = () => {
    this.chatContainer.innerHTML = "";
  };

  displayOwnMessage = (messObj: MessageObject) => {
    this.chatContainer.innerHTML += `
             <div class="message own-message">
               <div class="message-content">
                   <div class="message-username">${messObj.username}</div>
                   <div class="message-text">${messObj.message}</div>
                   <div class="message-time"></div>
                </div>
            </div>`;
  };
  displayOtherMessage = (messObj: MessageObject) => {
    this.chatContainer.innerHTML += `
             <div class="message own-message">
               <div class="message-content">
                   <div class="message-username">${messObj.username}</div>
                   <div class="message-text">${messObj.message}</div>
                   <div class="message-time"></div>
                </div>
            </div>`;
  };

  waitAnimationFrame = async () => {
    await new Promise((resolve) => requestAnimationFrame(resolve));
  };

  private initializeEmojiPicker = () => {
    // Обработчик клика на кнопку эмоджи
    this.emojiBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleEmojiPicker();
    });

    // Обработчик выбора эмоджи
    const emojiPickerElement = this.emojiPicker.querySelector("emoji-picker");
    if (emojiPickerElement) {
      emojiPickerElement.addEventListener("emoji-click", (event: any) => {
        const emoji = event.detail.unicode;
        this.insertEmoji(emoji);
        this.hideEmojiPicker();
      });
    }

    // Закрытие пикера при клике вне его
    document.addEventListener("click", (e) => {
      if (
        !this.emojiPicker.contains(e.target as Node) &&
        !this.emojiBtn.contains(e.target as Node)
      ) {
        this.hideEmojiPicker();
      }
    });
  };

  private toggleEmojiPicker = () => {
    if (this.emojiPicker.style.display === "none" || this.emojiPicker.style.display === "") {
      this.showEmojiPicker();
    } else {
      this.hideEmojiPicker();
    }
  };

  private showEmojiPicker = () => {
    this.emojiPicker.style.display = "block";
  };

  private hideEmojiPicker = () => {
    this.emojiPicker.style.display = "none";
  };

  private insertEmoji = (emoji: string) => {
    const currentValue = this.messageInput.value;
    const cursorPosition = this.messageInput.selectionStart || 0;
    const newValue =
      currentValue.slice(0, cursorPosition) + emoji + currentValue.slice(cursorPosition);
    this.messageInput.value = newValue;

    // Устанавливаем курсор после вставленного эмоджи
    const newCursorPosition = cursorPosition + emoji.length;
    this.messageInput.setSelectionRange(newCursorPosition, newCursorPosition);
    this.messageInput.focus();
  };
}
