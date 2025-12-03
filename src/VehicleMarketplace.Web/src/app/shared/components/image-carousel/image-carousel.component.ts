import { Component, input, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-image-carousel',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="relative">
      <!-- Main Image -->
      <div class="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4 image-zoom"
           (touchstart)="onTouchStart($event)"
           (touchmove)="onTouchMove($event)"
           (touchend)="onTouchEnd()">
        @if (images().length > 0) {
          <div class="relative w-full h-full" [class]="getSlideClass()">
            <img [src]="images()[currentIndex()]" alt="Vehicle image" 
              class="w-full h-full object-cover cursor-pointer"
              (click)="toggleFullscreen()"
              [style.transform]="'translateX(' + slideOffset() + 'px)'">
          </div>
        } @else {
          <div class="flex items-center justify-center h-full">
            <mat-icon class="text-8xl text-gray-400">directions_car</mat-icon>
          </div>
        }
      </div>
      
      <!-- Navigation Buttons -->
      @if (images().length > 1) {
        <button mat-icon-button 
          class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg transition-smooth hover:scale-110" 
          (click)="previous()" 
          [disabled]="currentIndex() === 0">
          <mat-icon>chevron_left</mat-icon>
        </button>
        
        <button mat-icon-button 
          class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg transition-smooth hover:scale-110"
          (click)="next()" 
          [disabled]="currentIndex() === images().length - 1">
          <mat-icon>chevron_right</mat-icon>
        </button>

        <!-- Image Counter -->
        <div class="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
          {{ currentIndex() + 1 }} / {{ images().length }}
        </div>

        <!-- Dots Indicator -->
        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          @for (img of images(); track $index) {
            <button
              (click)="jumpTo($index)"
              class="w-2 h-2 rounded-full transition-smooth"
              [class.bg-white]="$index === currentIndex()"
              [class.bg-white/50]="$index !== currentIndex()"
              [class.scale-125]="$index === currentIndex()">
            </button>
          }
        </div>
      }
      
      <!-- Thumbnails -->
      @if (images().length > 1) {
        <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          @for (img of images(); track $index) {
            <div class="flex-shrink-0 cursor-pointer transition-smooth"
                 (click)="jumpTo($index)">
              <img [src]="img" alt="Thumbnail {{ $index + 1 }}" 
                class="w-20 h-20 object-cover rounded transition-all"
                [class.ring-4]="$index === currentIndex()"
                [class.ring-indigo-600]="$index === currentIndex()"
                [class.opacity-50]="$index !== currentIndex()"
                [class.scale-110]="$index === currentIndex()">
            </div>
          }
        </div>
      }

      <!-- Fullscreen Modal -->
      @if (isFullscreen()) {
        <div class="fixed inset-0 bg-black/95 z-50 flex items-center justify-center animate-page-in"
          (click)="toggleFullscreen()"
          (touchstart)="onTouchStart($event)"
          (touchmove)="onTouchMove($event)"
          (touchend)="onTouchEnd()">
          <button mat-icon-button class="absolute top-4 right-4 text-white hover:scale-110 transition-smooth z-10">
            <mat-icon>close</mat-icon>
          </button>
          <div class="relative w-full h-full flex items-center justify-center" (click)="$event.stopPropagation()">
            <img [src]="images()[currentIndex()]" alt="Fullscreen image"
              class="max-w-full max-h-full object-contain transition-smooth"
              [style.transform]="'translateX(' + slideOffset() + 'px)'">
          </div>
          
          @if (images().length > 1) {
            <button mat-icon-button 
              class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:scale-125 transition-smooth"
              (click)="previous(); $event.stopPropagation()">
              <mat-icon class="text-4xl">chevron_left</mat-icon>
            </button>
            <button mat-icon-button 
              class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:scale-125 transition-smooth"
              (click)="next(); $event.stopPropagation()">
              <mat-icon class="text-4xl">chevron_right</mat-icon>
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `]
})
export class ImageCarouselComponent {
  images = input<string[]>([]);
  currentIndex = signal(0);
  isFullscreen = signal(false);
  slideOffset = signal(0);
  slideDirection = signal<'left' | 'right' | null>(null);

  private touchStartX = 0;
  private touchEndX = 0;
  private minSwipeDistance = 50;

  next(): void {
    if (this.currentIndex() < this.images().length - 1) {
      this.slideDirection.set('left');
      setTimeout(() => {
        this.currentIndex.update(i => i + 1);
        this.slideDirection.set(null);
      }, 100);
    }
  }

  previous(): void {
    if (this.currentIndex() > 0) {
      this.slideDirection.set('right');
      setTimeout(() => {
        this.currentIndex.update(i => i - 1);
        this.slideDirection.set(null);
      }, 100);
    }
  }

  jumpTo(index: number): void {
    if (index !== this.currentIndex()) {
      this.slideDirection.set(index > this.currentIndex() ? 'left' : 'right');
      setTimeout(() => {
        this.currentIndex.set(index);
        this.slideDirection.set(null);
      }, 100);
    }
  }

  toggleFullscreen(): void {
    this.isFullscreen.update(v => !v);
  }

  getSlideClass(): string {
    if (this.slideDirection() === 'left') return 'animate-swipe-left';
    if (this.slideDirection() === 'right') return 'animate-swipe-right';
    return 'animate-slide-from-left';
  }

  // Touch/Swipe Handlers
  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchMove(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].screenX;
    const diff = this.touchStartX - this.touchEndX;
    this.slideOffset.set(-diff);
  }

  onTouchEnd(): void {
    const swipeDistance = this.touchStartX - this.touchEndX;

    if (Math.abs(swipeDistance) > this.minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swiped left - next image
        this.next();
      } else {
        // Swiped right - previous image
        this.previous();
      }
    }

    // Reset
    this.slideOffset.set(0);
    this.touchStartX = 0;
    this.touchEndX = 0;
  }

  // Keyboard navigation
  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    if (!this.isFullscreen()) return;

    if (event.key === 'ArrowLeft') {
      this.previous();
    } else if (event.key === 'ArrowRight') {
      this.next();
    } else if (event.key === 'Escape') {
      this.toggleFullscreen();
    }
  }
}
