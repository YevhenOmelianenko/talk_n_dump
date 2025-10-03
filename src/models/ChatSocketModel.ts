import { io } from "socket.io-client";
import { MessageObject, ChatModel } from "./ChatModel";

export class ChatSocketModel extends ChatModel {
  private socketManager;

  constructor(host: string) {
    super(host);
    this.socketManager = io(this.host);
  }

  onNewMessage = (func: (message: MessageObject) => void) => {
    this.socketManager.on("newMessage", (message) => {
      func(message);
    });
  };

  sendMessage = async (message: MessageObject) => {
    if (!message.username || !message.message) {
      return;
    }

    this.socketManager.emit("sendMessage", {
      id: this.generateId(),
      username: message.username,
      message: message.message,
    });
  };
}
