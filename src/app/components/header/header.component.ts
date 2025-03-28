import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart/cart.service';
import { AuthService } from '../../services/auth/auth.service';
import { ThemeService } from '../../services/theme/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header" [class.dark-theme]="themeService.isDarkTheme$ | async">
      <div class="logo">
        <a routerLink="/shop" class="logo-link">MY ANGULAR APP</a>
      </div>
      <div class="user-section">
        <ng-container *ngIf="authService.isAuthenticated$ | async">
          <a routerLink="/cart" class="cart-icon">
            🛒 <span class="cart-count" *ngIf="cartCount > 0">{{ cartCount }}</span>
          </a>
          <span [class.admin-email]="authService.isAdmin() | async"
                [class.user-email]="!(authService.isAdmin() | async)"
                class="email-display">
            {{ authService.userEmail$ | async }}
          </span>
          <button class="theme-toggle" (click)="themeService.toggleTheme()">
            {{ (themeService.isDarkTheme$ | async) ? '☀️' : '🌙' }}
          </button>
          <button class="logout-btn" (click)="logout()">Logout</button>
        </ng-container>
        <ng-container *ngIf="!(authService.isAuthenticated$ | async)">
          <button class="theme-toggle" (click)="themeService.toggleTheme()">
            {{ (themeService.isDarkTheme$ | async) ? '☀️' : '🌙' }}
          </button>
          <button class="login-btn" routerLink="/login">Login</button>
        </ng-container>
      </div>
    </header>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background-color: #f8f9fa;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
      position: relative;
      z-index: 1000;
    }

    .logo-link {
      text-decoration: none;
      color: #333;
      font-size: 1.5rem;
      font-weight: bold;
      transition: color 0.3s ease;
      position: relative;
      padding: 5px 10px;
    }

    .logo-link:hover {
      color: #007bff;
    }

    .dark-theme .logo-link {
      color: #fff;
    }

    .dark-theme .logo-link:hover {
      color: #40c463;
    }

    .user-section {
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.3s ease;
    }

    .cart-icon {
      position: relative;
      text-decoration: none;
      font-size: 1.5rem;
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .cart-icon:hover {
      transform: scale(1.1);
    }

    .cart-count {
      position: absolute;
      top: -8px;
      right: -8px;
      background-color: #dc3545;
      color: white;
      border-radius: 50%;
      padding: 2px 6px;
      font-size: 0.8rem;
      font-weight: bold;
      transition: all 0.3s ease;
      animation: popIn 0.3s ease;
    }

    .email-display {
      padding: 5px 10px;
      border-radius: 4px;
      transition: all 0.3s ease;
      animation: slideIn 0.3s ease;
    }

    .admin-email {
      color: #28a745;
      font-weight: bold;
      font-size: 1.1rem;
      background-color: rgba(40, 167, 69, 0.1);
    }

    .user-email {
      color: #333;
      font-weight: bold;
      font-size: 1.1rem;
      background-color: rgba(0, 0, 0, 0.05);
    }

    .theme-toggle {
      padding: 8px;
      border: none;
      border-radius: 50%;
      background: transparent;
      cursor: pointer;
      font-size: 1.2rem;
      transition: all 0.3s ease;
      animation: rotateIn 0.5s ease;
    }

    .theme-toggle:hover {
      transform: rotate(360deg);
      background-color: rgba(0,0,0,0.1);
    }

    .login-btn, .logout-btn {
      padding: 0.5rem 1.2rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      animation: slideIn 0.3s ease;
    }

    .login-btn {
      background-color: #007bff;
      color: white;
    }

    .login-btn:hover {
      background-color: #0056b3;
      transform: translateY(-2px);
      box-shadow: 0 2px 8px rgba(0,123,255,0.4);
    }

    .logout-btn {
      background-color: #dc3545;
      color: white;
    }

    .logout-btn:hover {
      background-color: #c82333;
      transform: translateY(-2px);
      box-shadow: 0 2px 8px rgba(220,53,69,0.4);
    }

    .dark-theme {
      background-color: #333;
      color: white;
    }

    .dark-theme .theme-toggle:hover {
      background-color: rgba(255,255,255,0.1);
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes popIn {
      from {
        opacity: 0;
        transform: scale(0.5);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes rotateIn {
      from {
        opacity: 0;
        transform: rotate(-180deg);
      }
      to {
        opacity: 1;
        transform: rotate(0);
      }
    }
  `]
})
export class HeaderComponent {
  cartCount = 0;

  constructor(
    private cartService: CartService,
    private router: Router,
    public authService: AuthService,
    public themeService: ThemeService
  ) {
    this.cartService.cartItems$.subscribe(items => {
      this.cartCount = items.reduce((total, item) => total + item.quantity, 0);
    });
  }

  logout() {
    this.authService.logout();
  }
}
