import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart/cart.service';
import { AuthService } from '../../services/auth/auth.service';
import { ThemeService } from '../../services/theme/theme.service';
import { Role } from '../../models/role';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CartItem } from '../../models/cart_item';
import { selectCartCount, selectCartItems, selectCartTotal } from '../../state/cart/cart.selector';
import { log } from 'console';
import { RemoveFromCart, UpdateQuantity } from '../../state/cart/cart.actions';

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
  cartItems$: Observable<CartItem[]>  = new Observable<CartItem[]>();
  cartCount$: Observable<number>  = new Observable<number>();
  cartTotal$: Observable<number>  = new Observable<number>();

  constructor(
    private cartService: CartService,
    private router: Router,
    public authService: AuthService,
    public themeService: ThemeService,
    private store: Store
  ) {
    // this.cartService.cartItems$.subscribe(items => {
    //   this.cartItems = items;
    //   this.cartCount = items.reduce((total, item) => total + item.quantity, 0);
    // });
    
    this.themeService.isDarkTheme$.subscribe(isDark => {
      this.isDarkTheme = isDark;
    });

    this.authService.userEmail$.subscribe(email => {
      this.userEmail = email;
    });

    this.authService.userRole$.subscribe(role => {
      this.isAdmin = role === Role.ADMIN;
     
      
    });
  }

  ngOnInit() {
    this.cartItems$ = this.store.select(selectCartItems);
    this.cartCount$ = this.store.select(selectCartCount);
    this.cartTotal$ = this.store.select(selectCartTotal);  
        
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

  removeItem(productId: number) {
    this.store.dispatch(RemoveFromCart({ productId }));
  }
  
  updateItemQuantity(productId: number, quantity: number) {
    if (quantity >= 1) {  // Đảm bảo số lượng không âm
      this.store.dispatch(UpdateQuantity({ productId, quantity }));
    }
  }
}