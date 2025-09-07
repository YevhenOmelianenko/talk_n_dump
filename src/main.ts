// Основной TypeScript файл для чата

interface Message {
    id: string;
    text: string;
    sender: string;
    timestamp: Date;
    isOwn: boolean;
}

interface User {
    id: string;
    name: string;
    status: 'online' | 'offline';
}

class ChatApp {
    private messagesContainer: HTMLElement;
    private messageInput: HTMLInputElement;
    private sendButton: HTMLButtonElement;
    private username: string;
    private messages: Message[] = [];
    private currentUser: User;

    constructor() {
        this.messagesContainer = document.getElementById('messagesContainer') as HTMLElement;
        this.messageInput = document.getElementById('messageInput') as HTMLInputElement;
        this.sendButton = document.getElementById('sendButton') as HTMLButtonElement;
        this.username = 'Пользователь';
        
        this.currentUser = {
            id: 'user-1',
            name: this.username,
            status: 'online'
        };
        
        this.init();
    }
    
    private init(): void {
        this.setupEventListeners();
        this.addWelcomeMessage();
        this.updateUserStatus();
    }
    
    private setupEventListeners(): void {
        // Отправка сообщения по клику
        this.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });
        
        // Отправка сообщения по Enter
        this.messageInput.addEventListener('keypress', (e: KeyboardEvent) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Автофокус на поле ввода
        this.messageInput.focus();
    }
    
    private sendMessage(): void {
        const messageText = this.messageInput.value.trim();
        
        if (messageText === '') {
            return;
        }
        
        // Создаем объект сообщения
        const message: Message = {
            id: this.generateMessageId(),
            text: messageText,
            sender: this.username,
            timestamp: new Date(),
            isOwn: true
        };
        
        // Добавляем сообщение в массив
        this.messages.push(message);
        
        // Добавляем сообщение в UI
        this.addMessageToUI(message);
        
        // Очищаем поле ввода
        this.messageInput.value = '';
        
        // Здесь будет логика отправки на сервер
        console.log('Отправка сообщения:', message);
        
        // Имитация ответа от сервера (для демонстрации)
        setTimeout(() => {
            this.addServerResponse(messageText);
        }, 1000);
    }
    
    private addServerResponse(originalMessage: string): void {
        const responseMessage: Message = {
            id: this.generateMessageId(),
            text: `Сообщение "${originalMessage}" получено!`,
            sender: 'Сервер',
            timestamp: new Date(),
            isOwn: false
        };
        
        this.messages.push(responseMessage);
        this.addMessageToUI(responseMessage);
    }
    
    private addMessageToUI(message: Message): void {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.isOwn ? 'own-message' : ''}`;
        messageElement.setAttribute('data-message-id', message.id);
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = message.sender.charAt(0).toUpperCase();
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        const messageText = document.createElement('div');
        messageText.className = 'message-text';
        messageText.textContent = message.text;
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = this.formatTime(message.timestamp);
        
        content.appendChild(messageText);
        content.appendChild(messageTime);
        
        messageElement.appendChild(avatar);
        messageElement.appendChild(content);
        
        this.messagesContainer.appendChild(messageElement);
        
        // Прокрутка к последнему сообщению
        this.scrollToBottom();
    }
    
    private addWelcomeMessage(): void {
        const welcomeMessage: Message = {
            id: this.generateMessageId(),
            text: 'Добро пожаловать в чат!',
            sender: 'Система',
            timestamp: new Date(),
            isOwn: false
        };
        
        this.messages.push(welcomeMessage);
        this.addMessageToUI(welcomeMessage);
    }
    
    private updateUserStatus(): void {
        const statusElement = document.querySelector('.status') as HTMLElement;
        if (statusElement) {
            statusElement.className = `status ${this.currentUser.status}`;
        }
    }
    
    private formatTime(date: Date): string {
        return date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    private generateMessageId(): string {
        return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    private scrollToBottom(): void {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    // Публичные методы для внешнего использования
    public addMessage(text: string, sender: string, isOwn: boolean = false): void {
        const message: Message = {
            id: this.generateMessageId(),
            text,
            sender,
            timestamp: new Date(),
            isOwn
        };
        
        this.messages.push(message);
        this.addMessageToUI(message);
    }
    
    public getMessages(): Message[] {
        return [...this.messages];
    }
    
    public setUsername(username: string): void {
        this.username = username;
        this.currentUser.name = username;
    }
    
    public getUser(): User {
        return { ...this.currentUser };
    }
}

// Инициализация приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const chatApp = new ChatApp();
    
    // Делаем экземпляр доступным глобально для отладки
    (window as any).chatApp = chatApp;
});
