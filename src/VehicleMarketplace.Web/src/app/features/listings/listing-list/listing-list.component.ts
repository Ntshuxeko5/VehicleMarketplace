import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CarLoaderComponent } from '../../../shared/components/car-loader/car-loader.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { ListingService } from '../../../core/services/listing.service';
import { VehicleListing } from '../../../core/models/listing.models';
import { getVehicleIcon } from '../../../core/models/vehicle-category.models';

@Component({
  selector: 'app-listing-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    CarLoaderComponent,
    SkeletonLoaderComponent
  ],
  templateUrl: './listing-list.component.html',
  styleUrl: './listing-list.component.css'
})
export class ListingListComponent implements OnInit {
  private listingService = inject(ListingService);

  listings = signal<VehicleListing[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string>('');

  // Search and filter properties
  searchKeyword = signal<string>('');
  selectedCategory = signal<string>('');
  minPrice = signal<number>(0);
  maxPrice = signal<number>(1000000);
  minYear = signal<number>(1990);
  maxYear = signal<number>(new Date().getFullYear());
  selectedTransmission = signal<string>('');
  selectedFuelType = signal<string>('');
  selectedProvince = signal<string>('');

  transmissions = ['Manual', 'Automatic', 'CVT', 'DCT'];
  fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
  provinces = ['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Free State', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape'];
  categories = signal<any[]>([]);

  ngOnInit(): void {
    this.loadCategories();
    this.loadListings();
  }

  loadCategories(): void {
    this.listingService.getCategories().subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => console.error('Error loading categories', err)
    });
  }

  loadListings(): void {
    this.isLoading.set(true);
    const filters = this.buildFilters();

    this.listingService.getListings(filters).subscribe({
      next: (data) => {
        this.listings.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load listings. Please try again later.');
        this.isLoading.set(false);
      }
    });
  }

  private buildFilters(): any {
    const filters: any = {};

    if (this.searchKeyword()) filters.search = this.searchKeyword();
    if (this.selectedCategory()) filters.categoryId = this.selectedCategory();
    if (this.minPrice() > 0) filters.minPrice = this.minPrice();
    if (this.maxPrice() < 1000000) filters.maxPrice = this.maxPrice();
    if (this.minYear() > 1990) filters.minYear = this.minYear();
    if (this.maxYear() < new Date().getFullYear()) filters.maxYear = this.maxYear();
    if (this.selectedTransmission()) filters.transmission = this.selectedTransmission();
    if (this.selectedFuelType()) filters.fuelType = this.selectedFuelType();
    if (this.selectedProvince()) filters.province = this.selectedProvince();

    return filters;
  }

  applyFilters(): void {
    this.loadListings();
  }

  clearFilters(): void {
    this.searchKeyword.set('');
    this.selectedCategory.set('');
    this.minPrice.set(0);
    this.maxPrice.set(1000000);
    this.minYear.set(1990);
    this.maxYear.set(new Date().getFullYear());
    this.selectedTransmission.set('');
    this.selectedFuelType.set('');
    this.selectedProvince.set('');
    this.loadListings();
  }

  getVehicleIcon(categoryName: string): string {
    return getVehicleIcon(categoryName);
  }
}
