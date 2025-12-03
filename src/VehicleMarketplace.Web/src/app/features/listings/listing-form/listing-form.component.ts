import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ListingService } from '../../../core/services/listing.service';
import { Category, CreateListingRequest } from '../../../core/models/listing.models';

@Component({
  selector: 'app-listing-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './listing-form.component.html',
  styleUrl: './listing-form.component.css'
})
export class ListingFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private listingService = inject(ListingService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  listingForm = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
    year: [new Date().getFullYear(), [Validators.required, Validators.min(1900)]],
    mileage: [0, [Validators.required, Validators.min(0)]],
    make: ['', [Validators.required]],
    model: ['', [Validators.required]],
    transmission: ['', [Validators.required]],
    fuelType: ['', [Validators.required]],
    city: ['', [Validators.required]],
    province: ['', [Validators.required]],
    categoryId: ['', [Validators.required]]
  });

  categories = signal<Category[]>([]);
  isEditMode = signal<boolean>(false);
  listingId: string | null = null;
  isLoading = signal<boolean>(false);
  error = signal<string>('');

  transmissions = ['Manual', 'Automatic', 'CVT', 'DCT'];
  fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];

  selectedImages: File[] = [];
  imagePreviews: string[] = [];
  maxImages = 5;
  maxFileSize = 5 * 1024 * 1024; // 5MB

  ngOnInit(): void {
    this.loadCategories();
    this.listingId = this.route.snapshot.paramMap.get('id');
    if (this.listingId) {
      this.isEditMode.set(true);
      this.loadListing(this.listingId);
    }
  }

  loadCategories(): void {
    this.listingService.getCategories().subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => console.error('Error loading categories', err)
    });
  }

  loadListing(id: string): void {
    this.isLoading.set(true);
    this.listingService.getListing(id).subscribe({
      next: (data) => {
        this.listingForm.patchValue({
          title: data.title,
          description: data.description,
          price: data.price,
          year: data.year,
          mileage: data.mileage,
          make: data.make,
          model: data.model,
          transmission: data.transmission,
          fuelType: data.fuelType,
          city: data.city,
          province: data.province,
          categoryId: data.categoryId
        });
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load listing details.');
        this.isLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.listingForm.valid) {
      this.isLoading.set(true);
      this.error.set('');
      const request = this.listingForm.value as CreateListingRequest;

      if (this.isEditMode() && this.listingId) {
        this.listingService.updateListing(this.listingId, request).subscribe({
          next: async () => {
            // Upload images if any were selected
            if (this.selectedImages.length > 0) {
              await this.uploadImages(this.listingId!);
            }
            this.router.navigate(['/listings', this.listingId]);
          },
          error: (err) => {
            this.error.set('Failed to save listing. Please try again.');
            this.isLoading.set(false);
            console.error('Error saving listing', err);
          }
        });
      } else {
        this.listingService.createListing(request).subscribe({
          next: async (response) => {
            // Upload images if any were selected
            if (this.selectedImages.length > 0) {
              await this.uploadImages(response);
            }
            this.router.navigate(['/listings', response]);
          },
          error: (err) => {
            this.error.set('Failed to save listing. Please try again.');
            this.isLoading.set(false);
            console.error('Error saving listing', err);
          }
        });
      }
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.addFiles(Array.from(input.files));
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer?.files) {
      this.addFiles(Array.from(event.dataTransfer.files));
    }
  }

  private addFiles(files: File[]): void {
    for (const file of files) {
      // Check if we've reached max images
      if (this.selectedImages.length >= this.maxImages) {
        alert(`Maximum ${this.maxImages} images allowed`);
        break;
      }

      // Validate file type
      if (!file.type.match(/image\/(jpg|jpeg|png|webp)/)) {
        alert(`Invalid file type: ${file.name}. Only JPG, PNG, and WebP are allowed.`);
        continue;
      }

      // Validate file size
      if (file.size > this.maxFileSize) {
        alert(`File too large: ${file.name}. Maximum size is 5MB.`);
        continue;
      }

      // Add file and create preview
      this.selectedImages.push(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviews.push(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  private async uploadImages(listingId: string): Promise<void> {
    for (const file of this.selectedImages) {
      try {
        await this.listingService.uploadImage(listingId, file).toPromise();
      } catch (error) {
        console.error('Error uploading image', error);
      }
    }
  }
}
