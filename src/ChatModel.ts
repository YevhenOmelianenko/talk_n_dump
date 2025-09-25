import { v4 as uuidv4 } from "uuid";

export type MessageObject = {
  id?: string;
  username: string;
  message: string;
};

export class ChatModel {
  constructor() {}

  loadMessages = async (): Promise<MessageObject[]> => {
    const res = await fetch("http://46.101.114.148:3000/chat/messages");
    const json = await res.json();
    return json as MessageObject[];
  };

  isOwnMessage = (mesObj: MessageObject) => {
    const myIdsStr = localStorage.getItem("myIds");
    const myIds = myIdsStr ? JSON.parse(myIdsStr) : [];
    return myIds.includes(mesObj.id);
  };

  sendMessage = async (message: MessageObject) => {
    if (!message.username || !message.message) {
      return;
    }
    const id = uuidv4();
    const myidsStr = localStorage.getItem("myIds");
    const myIds = myidsStr ? JSON.parse(myidsStr) : [];
    myIds.push(id);
    localStorage.setItem("myIds", JSON.stringify(myIds));
    await fetch("http://46.101.114.148:3000/chat/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        username: message.username,
        message: message.message,
      }),
    });
  };
}
