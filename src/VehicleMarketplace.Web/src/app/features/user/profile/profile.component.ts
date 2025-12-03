import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ListingService } from '../../../core/services/listing.service';
import { VehicleListing } from '../../../core/models/listing.models';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        ReactiveFormsModule,
        MatTabsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule
    ],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
    authService = inject(AuthService);
    listingService = inject(ListingService);
    fb = inject(FormBuilder);

    myListings = signal<VehicleListing[]>([]);
    isLoading = signal(false);

    profileForm = this.fb.group({
        firstName: [this.authService.currentUser()?.firstName || '', Validators.required],
        lastName: [this.authService.currentUser()?.lastName || '', Validators.required],
        email: [{ value: this.authService.currentUser()?.email || '', disabled: true }],
        phoneNumber: ['']
    });

    passwordForm = this.fb.group({
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
    });

    ngOnInit(): void {
        this.loadMyListings();
    }

    loadMyListings(): void {
        this.isLoading.set(true);
        // Note: This would require a backend endpoint like /api/listings/my-listings
        // For now, we'll just show all listings
        this.listingService.getListings().subscribe({
            next: (data) => {
                this.myListings.set(data);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Error loading listings', err);
                this.isLoading.set(false);
            }
        });
    }

    updateProfile(): void {
        if (this.profileForm.valid) {
            console.log('Update profile:', this.profileForm.value);
            // Implement profile update logic
        }
    }

    changePassword(): void {
        if (this.passwordForm.valid) {
            const { newPassword, confirmPassword } = this.passwordForm.value;
            if (newPassword !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            console.log('Change password');
            // Implement password change logic
        }
    }

    deleteListing(id: string): void {
        if (confirm('Are you sure you want to delete this listing?')) {
            this.listingService.deleteListing(id).subscribe({
                next: () => {
                    this.loadMyListings();
                },
                error: (err) => console.error('Error deleting listing', err)
            });
        }
    }
}
