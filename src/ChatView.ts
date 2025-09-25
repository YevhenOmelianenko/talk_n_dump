import { MessageObject } from "./ChatModel";
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

  isAtDown = () => this.chatContainer.scrollTop === this.chatContainer.scrollHeight;
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
}
