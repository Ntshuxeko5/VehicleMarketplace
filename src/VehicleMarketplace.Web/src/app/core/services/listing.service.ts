import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { VehicleListing, CreateListingRequest, Category } from '../models/listing.models';

@Injectable({
    providedIn: 'root'
})
export class ListingService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/listings`;
    private categoriesUrl = `${environment.apiUrl}/categories`;

    getListings(params?: any): Observable<VehicleListing[]> {
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key]) {
                    httpParams = httpParams.set(key, params[key]);
                }
            });
        }
        return this.http.get<VehicleListing[]>(this.apiUrl, { params: httpParams });
    }

    getListing(id: string): Observable<VehicleListing> {
        return this.http.get<VehicleListing>(`${this.apiUrl}/${id}`);
    }

    createListing(listing: CreateListingRequest): Observable<string> {
        return this.http.post<string>(this.apiUrl, listing);
    }

    updateListing(id: string, listing: CreateListingRequest): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, listing);
    }

    deleteListing(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(this.categoriesUrl);
    }

    uploadImage(listingId: string, file: File): Observable<void> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<void>(`${this.apiUrl}/${listingId}/images`, formData);
    }

    getPendingListings(): Observable<VehicleListing[]> {
        return this.http.get<VehicleListing[]>(`${this.apiUrl}/pending`);
    }

    approveListing(id: string): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}/approve`, {});
    }

    rejectListing(id: string): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}/reject`, {});
    }
}
