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
  hideChatContainer = async () => {
    this.chatContainer.style.visibility = "hidden";
  };
  showChatContainer = async () => {
    this.chatContainer.style.visibility = "visible";
  };
}
