import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CarLoaderComponent } from '../../../shared/components/car-loader/car-loader.component';
import { ListingService } from '../../../core/services/listing.service';
import { VehicleListing } from '../../../core/models/listing.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    CarLoaderComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private listingService = inject(ListingService);

  pendingListings = signal<VehicleListing[]>([]);
  isLoading = signal<boolean>(true);
  displayedColumns: string[] = ['title', 'price', 'user', 'actions'];

  ngOnInit(): void {
    this.loadPendingListings();
  }

  loadPendingListings(): void {
    this.isLoading.set(true);
    this.listingService.getPendingListings().subscribe({
      next: (data) => {
        this.pendingListings.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading pending listings', err);
        this.isLoading.set(false);
      }
    });
  }

  approve(id: string): void {
    if (confirm('Are you sure you want to approve this listing?')) {
      this.listingService.approveListing(id).subscribe({
        next: () => this.loadPendingListings(),
        error: (err) => console.error('Error approving listing', err)
      });
    }
  }

  reject(id: string): void {
    if (confirm('Are you sure you want to reject this listing?')) {
      this.listingService.rejectListing(id).subscribe({
        next: () => this.loadPendingListings(),
        error: (err) => console.error('Error rejecting listing', err)
      });
    }
  }
}
