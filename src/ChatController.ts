import { ChatModel } from "./ChatModel";
import { ChatView } from "./ChatView";

export class ChatController {
  private model: ChatModel;
  private view: ChatView;
  private loadInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.model = new ChatModel();
    this.view = new ChatView();
  }

  // Инициализация приложения
  async initialize(): Promise<void> {
    await this.hideChatContainer();
    await this.loadChat();
    await this.scrollToBottom();
    await this.showChatContainer();
    this.startAutoRefresh();
    this.setupEventListeners();
  }

  // Скрытие чата
  private async hideChatContainer(): Promise<void> {
    this.view.hideChatContainer();
  }

  // Показ чата
  private async showChatContainer(): Promise<void> {
    this.view.showChatContainer();
  }

  // Скролл к низу
  private async scrollToBottom(): Promise<void> {
    this.view.scrollToBottom();
  }

  // Загрузка чата
  private async loadChat(): Promise<void> {
    const messages = await this.model.getMessages();
    const messagesHTML = this.model.generateMessagesHTML(messages);
    this.view.displayMessages(messagesHTML);

    await new Promise((resolve) => requestAnimationFrame(resolve));

    if (this.view.isAtBottom()) {
      this.scrollToBottom();
    }
  }

  // Запуск автообновления
  private startAutoRefresh(): void {
    this.loadInterval = setInterval(() => {
      this.loadChat();
    }, 1000);
  }

  // Отправка сообщения
  private async sendMessage(): Promise<void> {
    const username = this.view.getUsername();
    const message = this.view.getMessage();

    if (!username || !message) {
      return;
    }

    await this.model.sendMessage(username, message);
    this.view.clearMessage();
  }

  // Обработка клика по эмоджи
  private handleEmojiClick(event: any): void {
    const emoji = event.detail.unicode;
    this.view.insertEmojiAtCursor(emoji);
    this.view.hideEmojiPicker();
  }

  // Обработка клика вне эмоджи панели
  private handleDocumentClick(e: Event): void {
    const target = e.target as Node;
    if (this.view.isClickOutsideEmoji(target)) {
      this.view.hideEmojiPicker();
    }
  }

  // Настройка обработчиков событий
  private setupEventListeners(): void {
    // События чата
    this.view.onSendClick(() => this.sendMessage());
    this.view.onMessageKeyUp(async (e) => {
      if (e.key === "Enter") {
        await this.sendMessage();
      }
    });

    // События эмоджи
    this.view.onEmojiBtnClick(() => this.view.toggleEmojiPicker());
    this.view.onEmojiClick((event) => this.handleEmojiClick(event));
    this.view.onDocumentClick((e) => this.handleDocumentClick(e));
  }

  // Очистка ресурсов
  destroy(): void {
    if (this.loadInterval) {
      clearInterval(this.loadInterval);
    }
  }
}
