import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-car-loader',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="car-loader-container">
      <div class="car-loader">
        <svg class="car-svg" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
          <!-- Car Body -->
          <rect x="30" y="50" width="120" height="30" rx="5" fill="#3f51b5" class="car-body"/>
          <!-- Car Roof -->
          <path d="M 50 50 L 65 30 L 115 30 L 130 50 Z" fill="#3f51b5" class="car-roof"/>
          <!-- Windows -->
          <path d="M 55 48 L 67 32 L 95 32 L 95 48 Z" fill="#87CEEB" class="car-window"/>
          <path d="M 100 48 L 100 32 L 125 32 L 125 48 Z" fill="#87CEEB" class="car-window"/>
          <!-- Wheels -->
          <circle cx="60" cy="80" r="12" fill="#333" class="wheel wheel-front"/>
          <circle cx="60" cy="80" r="6" fill="#666" class="wheel-center"/>
          <circle cx="120" cy="80" r="12" fill="#333" class="wheel wheel-back"/>
          <circle cx="120" cy="80" r="6" fill="#666" class="wheel-center"/>
          <!-- Headlight -->
          <circle cx="145" cy="60" r="3" fill="#FFD700" class="headlight"/>
        </svg>
        <div class="road"></div>
      </div>
      <p class="loading-text">Loading...</p>
    </div>
  `,
    styles: [`
    .car-loader-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 200px;
      gap: 20px;
    }

    .car-loader {
      position: relative;
      width: 200px;
      height: 100px;
    }

    .car-svg {
      width: 100%;
      height: 100%;
      animation: car-bounce 0.6s ease-in-out infinite;
    }

    .wheel {
      animation: wheel-spin 1s linear infinite;
      transform-origin: center;
    }

    .headlight {
      animation: blink 1.5s ease-in-out infinite;
    }

    .road {
      position: absolute;
      bottom: 5px;
      left: 0;
      right: 0;
      height: 3px;
      background: repeating-linear-gradient(
        to right,
        #666 0px,
        #666 20px,
        transparent 20px,
        transparent 40px
      );
      animation: road-move 1s linear infinite;
    }

    .loading-text {
      font-size: 18px;
      font-weight: 500;
      color: #3f51b5;
      animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes car-bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }

    @keyframes wheel-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    @keyframes road-move {
      from { background-position: 0 0; }
      to { background-position: 40px 0; }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `]
})
export class CarLoaderComponent { }
