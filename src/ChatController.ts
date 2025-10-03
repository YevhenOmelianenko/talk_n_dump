import { ChatSocketModel } from "./models/ChatSocketModel";
import { MessageObject } from "./models/ChatModel";
import { ChatView } from "./ChatView";

export class ChatController {
  private model: ChatSocketModel;
  private view: ChatView;
  constructor() {
    this.model = new ChatSocketModel(process.env.HOST || "http://localhost:3000");
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

    // setInterval(this.loadChat, 1000);
    this.model.onNewMessage(async (message: MessageObject) => {
      this.displayMessages([message]);
    });
  };

  private loadChat = async () => {
    const messages = await this.model.loadMessages();
    this.view.clearMessages();
    this.displayMessages(messages);
  };

  private displayMessages = async (messages: MessageObject[]) => {
    messages.forEach((message) => {
      if (this.model.isOwnMessage(message)) {
        this.view.displayOtherMessage(message);
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
