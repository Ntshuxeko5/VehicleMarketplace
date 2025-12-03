import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CarLoaderComponent } from '../../../shared/components/car-loader/car-loader.component';
import { MatCardModule } from '@angular/material/card';
import { ListingService } from '../../../core/services/listing.service';
import { VehicleListing } from '../../../core/models/listing.models';

@Component({
  selector: 'app-listing-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    CarLoaderComponent,
    MatCardModule
  ],
  templateUrl: './listing-detail.component.html',
  styleUrl: './listing-detail.component.css'
})
export class ListingDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private listingService = inject(ListingService);

  listing = signal<VehicleListing | null>(null);
  isLoading = signal<boolean>(true);
  error = signal<string>('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadListing(id);
    } else {
      this.error.set('Invalid listing ID');
      this.isLoading.set(false);
    }
  }

  loadListing(id: string): void {
    this.isLoading.set(true);
    this.listingService.getListing(id).subscribe({
      next: (data) => {
        this.listing.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load listing details.');
        this.isLoading.set(false);
        console.error('Error loading listing', err);
      }
    });
  }
}
