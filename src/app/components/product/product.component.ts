import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product/product.service';
import { CartService } from '../../services/cart/cart.service';
import { Router } from '@angular/router';
import { Observable, take } from 'rxjs';
import { CartItem } from '../../models/cart_item';
import { Store } from '@ngrx/store';
import { CartState } from '../../state/cart/cart.reducer';
import { selectCartItems, selectCartTotal } from '../../state/cart/cart.selector';
import { AddToCart } from '../../state/cart/cart.actions';
import { AuthService } from '../../services/auth/auth.service';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  categories: string[] = ['All'];
  selectedCategory: string = 'All';
  isDarkTheme = false;
  cartItems$: Observable<CartItem[]> = new Observable<CartItem[]>();
  cartTotal$: Observable<number> = new Observable<number>();
  
  constructor(private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private authService: AuthService,
    private store: Store<CartState>
  ) {}

  ngOnInit() {
    this.cartItems$ = this.store.select(selectCartItems); 
    this.cartTotal$ = this.store.select(selectCartTotal);  
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
      this.extractCategories();
    });
  }

  extractCategories() {
    const uniqueCategories = new Set(this.products.map((p) => p.category));
    this.categories = ['All', ...uniqueCategories];
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
  }

  getFilteredProducts(): Product[] {
    return this.selectedCategory === 'All'
      ? this.products
      : this.products.filter((p) => p.category === this.selectedCategory);
  }

  onBuy(product: Product) {
    alert(`Thank you for purchasing ${product.title}!`);
  }

  addToCart(product: Product) {
    this.authService.isAuthenticated$.pipe(take(1)).subscribe(isLoggedIn => {
      if (!isLoggedIn) {
        alert('Please log in to add items to your cart.');
        // this.router.navigate(['/login']);
        return;
      }
  
      const cartItem: CartItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      };
  
      this.store.dispatch(AddToCart({ cartItem }));
    });
  }

  viewProductDetail(productId: number) {
    this.router.navigate(['/product', productId]);
  }
}
