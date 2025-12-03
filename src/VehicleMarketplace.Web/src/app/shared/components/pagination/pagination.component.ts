import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

export interface PageInfo {
  pageNumber: number;
  pageSize: number;
}

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatSelectModule],
  template: `
    <div class="flex items-center justify-between p-4 bg-white rounded-lg shadow animate-page-in">
      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-600">Items per page:</span>
        <select [(ngModel)]="currentPageSize" (change)="onPageSizeChange()" 
          class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-smooth">
          <option [value]="12">12</option>
          <option [value]="24">24</option>
          <option [value]="48">48</option>
        </select>
        <span class="text-sm text-gray-600">
          {{ (currentPage() - 1) * pageSize() + 1 }} - 
          {{ Math.min(currentPage() * pageSize(), totalItems()) }} of {{ totalItems() }}
        </span>
      </div>

      <div class="flex items-center gap-1">
        <button mat-icon-button 
          [disabled]="currentPage() === 1" 
          (click)="onPageChange(currentPage() - 1)"
          class="page-btn"
          [@slideAnimation]="animationDirection()">
          <mat-icon>chevron_left</mat-icon>
        </button>
        
        @for (page of getPageNumbers(); track page) {
          @if (page === -1) {
            <span class="px-2 text-gray-400">...</span>
          } @else {
            <button mat-icon-button 
              [color]="page === currentPage() ? 'primary' : ''" 
              (click)="onPageChange(page)"
              class="page-btn min-w-[40px] transition-spring"
              [class.scale-110]="page === currentPage()"
              [class.font-bold]="page === currentPage()">
              {{ page }}
            </button>
          }
        }
        
        <button mat-icon-button 
          [disabled]="currentPage() === totalPages()" 
          (click)="onPageChange(currentPage() + 1)"
          class="page-btn"
          [@slideAnimation]="animationDirection()">
          <mat-icon>chevron_right</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
  animations: [
    // Angular animations will be added if needed
  ]
})
export class PaginationComponent {
  currentPage = input<number>(1);
  pageSize = input<number>(12);
  totalItems = input<number>(0);
  pageChange = output<PageInfo>();

  currentPageSize = this.pageSize();
  animationDirection = signal<'forward' | 'backward'>('forward');
  Math = Math;

  ngOnInit(): void {
    this.currentPageSize = this.pageSize();
  }

  totalPages(): number {
    return Math.ceil(this.totalItems() / this.pageSize());
  }

  getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const delta = 2;

    const range: number[] = [];
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }

    if (current - delta > 2) range.unshift(-1);
    if (current + delta < total - 1) range.push(-1);

    range.unshift(1);
    if (total > 1) range.push(total);

    return range.filter((v, i, a) => a.indexOf(v) === i);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages() && page !== this.currentPage()) {
      this.animationDirection.set(page > this.currentPage() ? 'forward' : 'backward');
      this.pageChange.emit({ pageNumber: page, pageSize: this.pageSize() });
    }
  }

  onPageSizeChange(): void {
    this.pageChange.emit({ pageNumber: 1, pageSize: this.currentPageSize });
  }
}
