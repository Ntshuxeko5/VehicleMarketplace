import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-skeleton-loader',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="animate-page-in">
      @if (type() === 'card') {
        <div class="space-y-6">
          @for (item of [].constructor(count()); track $index) {
            <div class="bg-white rounded-lg shadow p-4 space-y-4">
              <div class="skeleton h-48 w-full"></div>
              <div class="space-y-2">
                <div class="skeleton h-6 w-3/4"></div>
                <div class="skeleton h-4 w-1/2"></div>
                <div class="skeleton h-4 w-full"></div>
                <div class="skeleton h-4 w-full"></div>
              </div>
              <div class="flex gap-2">
                <div class="skeleton h-10 w-24"></div>
                <div class="skeleton h-10 w-24"></div>
              </div>
            </div>
          }
        </div>
      } @else if (type() === 'list') {
        <div class="space-y-4">
          @for (item of [].constructor(count()); track $index) {
            <div class="bg-white rounded-lg shadow p-4 flex gap-4">
              <div class="skeleton h-24 w-24 flex-shrink-0"></div>
              <div class="flex-1 space-y-2">
                <div class="skeleton h-6 w-3/4"></div>
                <div class="skeleton h-4 w-1/2"></div>
                <div class="skeleton h-4 w-full"></div>
              </div>
            </div>
          }
        </div>
      } @else if (type() === 'grid') {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (item of [].constructor(count()); track $index) {
            <div class="bg-white rounded-lg shadow overflow-hidden">
              <div class="skeleton h-48 w-full"></div>
              <div class="p-4 space-y-2">
                <div class="skeleton h-6 w-3/4"></div>
                <div class="skeleton h-4 w-1/2"></div>
                <div class="flex justify-between">
                  <div class="skeleton h-4 w-1/4"></div>
                  <div class="skeleton h-4 w-1/4"></div>
                </div>
              </div>
            </div>
          }
        </div>
      } @else {
        <!-- Default dots loading -->
        <div class="flex justify-center items-center py-12">
          <div class="dots-loading">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      }
    </div>
  `,
    styles: []
})
export class SkeletonLoaderComponent {
    type = input<'card' | 'list' | 'grid' | 'dots'>('grid');
    count = input<number>(6);
}
