import { Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({ providedIn: 'root' })
export class SignalRService {
    private hubConnection?: signalR.HubConnection;
    isConnected = signal(false);

    async startConnection(token: string): Promise<void> {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:7001/hubs/chat', {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect()
            .build();

        try {
            await this.hubConnection.start();
            this.isConnected.set(true);
            console.log('SignalR Connected');
        } catch (err) {
            console.error('SignalR Connection Error:', err);
            setTimeout(() => this.startConnection(token), 5000);
        }
    }

    async joinConversation(conversationId: string) {
        if (!this.hubConnection) return;
        await this.hubConnection.invoke('JoinConversation', conversationId);
    }

    async sendMessage(conversationId: string, content: string) {
        if (!this.hubConnection) return;
        await this.hubConnection.invoke('SendMessage', conversationId, content);
    }

    async userTyping(conversationId: string, isTyping: boolean) {
        if (!this.hubConnection) return;
        await this.hubConnection.invoke('UserTyping', conversationId, isTyping);
    }

    onMessageReceived(callback: (message: any) => void) {
        this.hubConnection?.on('ReceiveMessage', callback);
    }

    onUserTyping(callback: (data: any) => void) {
        this.hubConnection?.on('UserTyping', callback);
    }

    async stop() {
        if (this.hubConnection) {
            await this.hubConnection.stop();
            this.isConnected.set(false);
        }
    }
}
