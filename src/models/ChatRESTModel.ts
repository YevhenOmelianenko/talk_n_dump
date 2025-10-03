import { MessageObject, ChatModel } from "./ChatModel";

export class ChatRESTModel extends ChatModel {
  constructor(host: string) {
    super(host);
  }

  sendMessage = async (message: MessageObject) => {
    if (!message.username || !message.message) {
      return;
    }

    await fetch(`${this.host}/chat/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: this.generateId(),
        username: message.username,
        message: message.message,
      }),
    });
  };
}
