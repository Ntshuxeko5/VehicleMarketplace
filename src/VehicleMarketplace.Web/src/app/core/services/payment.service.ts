import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export enum PaymentType {
    PremiumListing = 0,
    FeaturedListing = 1,
    SubscriptionMonthly = 2,
    SubscriptionYearly = 3
}

export interface PaymentHistory {
    id: string;
    amount: number;
    type: PaymentType;
    status: string;
    createdAt: Date;
    completedAt?: Date;
    listing?: { id: string; title: string };
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/payments`;

    initializePayment(amount: number, listingId: string | null, type: PaymentType): Observable<{
        authUrl: string;
        reference: string;
        id: string;
    }> {
        return this.http.post<any>(`${this.apiUrl}/initialize`, {
            amount,
            listingId,
            type
        });
    }

    verifyPayment(reference: string): Observable<{
        success: boolean;
        payment: any;
    }> {
        return this.http.post<any>(`${this.apiUrl}/verify/${reference}`, {});
    }

    getPaymentHistory(): Observable<PaymentHistory[]> {
        return this.http.get<PaymentHistory[]>(`${this.apiUrl}/history`);
    }

    // Helper to open Paystack checkout
    openPaystackCheckout(authUrl: string): void {
        window.open(authUrl, '_blank', 'width=600,height=700');
    }
}
