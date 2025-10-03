import { v4 as uuidv4 } from "uuid";

export type MessageObject = {
  id?: string;
  username: string;
  message: string;
};

export abstract class ChatModel {
  protected host: string;

  constructor(host: string) {
    this.host = host;
  }

  isOwnMessage = (mesObj: MessageObject) => {
    const myIdsStr = localStorage.getItem("myIds");
    const myIds = myIdsStr ? JSON.parse(myIdsStr) : [];
    return myIds.includes(mesObj.id);
  };

  loadMessages = async (): Promise<MessageObject[]> => {
    const res = await fetch(`${this.host}/chat/messages`);
    const json = await res.json();
    return json as MessageObject[];
  };

  generateId = () => {
    const id = uuidv4();
    const myidsStr = localStorage.getItem("myIds");
    const myIds = myidsStr ? JSON.parse(myidsStr) : [];
    myIds.push(id);
    localStorage.setItem("myIds", JSON.stringify(myIds));

    return id;
  };
}
