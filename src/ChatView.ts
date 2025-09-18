export class ChatView {
  private chatContainer: HTMLElement;
  private usernameInput: HTMLInputElement;
  private messageInput: HTMLInputElement;
  private sendBtn: HTMLElement;
  private emojiBtn: HTMLElement;
  private emojiPicker: HTMLElement;
  private emojiPickerElement: any;

  constructor() {
    this.chatContainer = document.getElementById("chatContainer")!;
    this.usernameInput = document.getElementById("usernameInput") as HTMLInputElement;
    this.messageInput = document.getElementById("messageInput") as HTMLInputElement;
    this.sendBtn = document.getElementById("sendBtn")!;
    this.emojiBtn = document.getElementById("emojiBtn")!;
    this.emojiPicker = document.getElementById("emojiPicker")!;
    this.emojiPickerElement = this.emojiPicker.querySelector("emoji-picker");
  }

  // Управление видимостью чата
  hideChatContainer(): void {
    this.chatContainer.style.visibility = "hidden";
  }

  showChatContainer(): void {
    this.chatContainer.style.visibility = "visible";
  }

  // Управление скроллом
  isAtBottom(): boolean {
    return this.chatContainer.scrollTop === this.chatContainer.scrollHeight;
  }

  scrollToBottom(): void {
    this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
  }

  // Отображение сообщений
  displayMessages(messagesHTML: string): void {
    this.chatContainer.innerHTML = messagesHTML;
  }

  // Получение данных из формы
  getUsername(): string {
    return this.usernameInput.value;
  }

  getMessage(): string {
    return this.messageInput.value;
  }

  // Очистка поля сообщения
  clearMessage(): void {
    this.messageInput.value = "";
    this.messageInput.focus();
  }

  // Управление эмоджи
  toggleEmojiPicker(): void {
    const isVisible = this.emojiPicker.style.display !== "none";
    this.emojiPicker.style.display = isVisible ? "none" : "block";
  }

  hideEmojiPicker(): void {
    this.emojiPicker.style.display = "none";
  }

  // Работа с текстом сообщения для эмоджи
  insertEmojiAtCursor(emoji: string): void {
    const cursorPosition = this.messageInput.selectionStart || 0;
    const textBefore = this.messageInput.value.substring(0, cursorPosition);
    const textAfter = this.messageInput.value.substring(cursorPosition);
    this.messageInput.value = textBefore + emoji + textAfter;
    this.messageInput.focus();
    this.messageInput.setSelectionRange(cursorPosition + emoji.length, cursorPosition + emoji.length);
  }

  // Проверка клика вне эмоджи панели
  isClickOutsideEmoji(target: Node): boolean {
    return !this.emojiBtn.contains(target) && !this.emojiPicker.contains(target);
  }

  // Обработчики событий
  onSendClick(callback: () => void): void {
    this.sendBtn.addEventListener("click", callback);
  }

  onMessageKeyUp(callback: (e: KeyboardEvent) => void): void {
    this.messageInput.addEventListener("keyup", callback);
  }

  onEmojiBtnClick(callback: () => void): void {
    this.emojiBtn.addEventListener("click", callback);
  }

  onEmojiClick(callback: (event: any) => void): void {
    this.emojiPickerElement.addEventListener("emoji-click", callback);
  }

  onDocumentClick(callback: (e: Event) => void): void {
    document.addEventListener("click", callback);
  }
}
