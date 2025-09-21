import { ChatModel } from "./ChatModel";
import { ChatView } from "./ChatView";

export class ChatController {
  private model: ChatModel;
  private view: ChatView;
  constructor() {
    this.model = new ChatModel();
    this.view = new ChatView();
  }
}
