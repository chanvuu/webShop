import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart/cart.service';
import { AuthService } from '../../services/auth/auth.service';
import { ThemeService } from '../../services/theme/theme.service';
import { Role } from '../../models/role';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  cartCount = 0;
  isCartOpen = false;
  cartItems: any[] = [];
  isDarkTheme = false;
  userEmail: string = '';
  isAdmin: boolean = false;

  constructor(
    private cartService: CartService,
    private router: Router,
    public authService: AuthService,
    public themeService: ThemeService
  ) {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.cartCount = items.reduce((total, item) => total + item.quantity, 0);
    });
    
    this.themeService.isDarkTheme$.subscribe(isDark => {
      this.isDarkTheme = isDark;
    });

    this.authService.userEmail$.subscribe(email => {
      this.userEmail = email;
    });

    this.authService.userRole$.subscribe(role => {
      this.isAdmin = role === Role.ADMIN;
      if (this.isAdmin) {
        this.router.navigate(['/admin']);
      }
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  openLogin() {
    this.router.navigate(['/login']);
  }

  toggleCartSidebar() {
    this.isCartOpen = !this.isCartOpen;
  }

  logout() {
    this.authService.logout();
  }
}
