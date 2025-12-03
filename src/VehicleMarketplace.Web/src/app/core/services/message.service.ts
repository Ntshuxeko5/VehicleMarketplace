import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Conversation {
    id: string;
    listingId?: string;
    listing?: { id: string; title: string };
    buyer: { id: string; firstName: string; lastName: string };
    seller: { id: string; firstName: string; lastName: string };
    lastMessageAt: Date;
    unreadCount: number;
}

export interface Message {
    id: string;
    content: string;
    sentAt: Date;
    isRead: boolean;
    sender: { id: string; firstName: string; lastName: string };
}

@Injectable({ providedIn: 'root' })
export class MessageService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/messages`;

    getConversations(): Observable<Conversation[]> {
        return this.http.get<Conversation[]>(`${this.apiUrl}/conversations`);
    }

    createConversation(listingId: string, sellerId: string, isSupport = false): Observable<{ id: string }> {
        return this.http.post<{ id: string }>(`${this.apiUrl}/conversations`, {
            listingId,
            sellerId,
            isSupport
        });
    }

    getMessages(conversationId: string): Observable<Message[]> {
        return this.http.get<Message[]>(`${this.apiUrl}/conversations/${conversationId}/messages`);
    }

    sendMessage(conversationId: string, content: string): Observable<{ id: string }> {
        return this.http.post<{ id: string }>(`${this.apiUrl}/conversations/${conversationId}/messages`, {
            content
        });
    }

    markAsRead(conversationId: string): Observable<void> {
        return this.http.patch<void>(`${this.apiUrl}/conversations/${conversationId}/read`, {});
    }
}
