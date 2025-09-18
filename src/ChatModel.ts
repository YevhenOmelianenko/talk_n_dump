import { v4 as uuidv4 } from "uuid";

export type MessageObject = {
  id: string;
  username: string;
  message: string;
};

export class ChatModel {
  private readonly baseUrl = "http://46.101.114.148:3000/chat";
  private readonly myIdsKey = "myIds";

  // Получение сообщений с сервера
  async getMessages(): Promise<MessageObject[]> {
    const res = await fetch(`${this.baseUrl}/messages`);
    return await res.json();
  }

  // Отправка сообщения на сервер
  async sendMessage(username: string, message: string): Promise<void> {
    const id = uuidv4();
    this.addMessageId(id);

    await fetch(`${this.baseUrl}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        username,
        message,
      }),
    });
  }

  // Проверка, является ли сообщение собственным
  isOwnMessage(messageObj: MessageObject): boolean {
    const myIds = this.getMyMessageIds();
    return myIds.includes(messageObj.id);
  }

  // Получение ID собственных сообщений из localStorage
  private getMyMessageIds(): string[] {
    const myIdsStr = localStorage.getItem(this.myIdsKey);
    return myIdsStr ? JSON.parse(myIdsStr) : [];
  }

  // Добавление ID сообщения в localStorage
  private addMessageId(id: string): void {
    const myIds = this.getMyMessageIds();
    myIds.push(id);
    localStorage.setItem(this.myIdsKey, JSON.stringify(myIds));
  }

  // Генерация HTML для сообщения
  generateMessageHTML(messageObj: MessageObject): string {
    const isOwn = this.isOwnMessage(messageObj);
    const messageClass = isOwn ? "message own-message" : "message";
    
    return `<div class="${messageClass}">
              <div class="message-content">
                  <div class="message-username">${messageObj.username}</div>
                  <div class="message-text">${messageObj.message}</div>
                  <div class="message-time"></div>
               </div>
           </div>`;
  }

  // Генерация HTML для всех сообщений
  generateMessagesHTML(messages: MessageObject[]): string {
    return messages
      .map((messageObj) => this.generateMessageHTML(messageObj))
      .join("\n");
  }
}
