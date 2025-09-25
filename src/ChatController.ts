import { ChatModel } from "./ChatModel";
import { MessageObject } from "./ChatModel";
import { ChatView } from "./ChatView";

export class ChatController {
  private model: ChatModel;
  private view: ChatView;
  constructor() {
    this.model = new ChatModel();
    this.view = new ChatView();

    this.view.onReady(() => {
      this.initialize();
    });
  }
  private initialize = async () => {
    await this.view.hideChatContainer();
    await this.loadChat();
    await this.view.scrollToDown();
    await this.view.showChatContainer();

    this.view.onSendMessage((message: MessageObject) => {
      this.model.sendMessage(message);
    });

    setInterval(this.loadChat, 1000);
  };

  private loadChat = async () => {
    const messages = await this.model.loadMessages();
    this.view.clearMessages();
    messages.forEach((message) => {
      if (this.model.isOwnMessage(message)) {
        this.view.displayOwnMessage(message);
      } else {
        this.view.displayOtherMessage(message);
      }
    });

    await this.view.waitAnimationFrame();

    if (this.view.isAtDown()) {
      this.view.scrollToDown();
    }
  };
}
