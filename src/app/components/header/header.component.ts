import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';
import { log } from 'console';



@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: true,
})
export class HeaderComponent {
  isDarkTheme = false;
  isCartOpen = false;
  cartItems: any[] = [];
  cartCount = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.cartCount = items.reduce((total, item) => total + item.quantity, 0);
      console.log(this.cartItems);
      console.log("ahhh", this.cartCount);      
    });
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.classList.toggle('dark-theme', this.isDarkTheme);
  }

  toggleCartSidebar() {
    this.isCartOpen = !this.isCartOpen;
  }

}
