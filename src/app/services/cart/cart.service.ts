import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class CartService {
  private baseUrl = 'https://fakestoreapi.com';
  private userId = 1;
  private cartId: number | null = null;

  private cartItems = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItems.asObservable();

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  // 🛒 Load giỏ hàng của user và lấy thông tin sản phẩm
  loadCart() {
    this.http.get<any[]>(`${this.baseUrl}/carts/user/${this.userId}`).subscribe(carts => {
      if (carts.length > 0) {
        this.cartId = carts[0].id;
        this.fetchProductDetails(carts[0].products);
      } else {
        this.cartItems.next([]);
      }
    });
  }

  // 🔄 Lấy thông tin chi tiết sản phẩm từ API
  private fetchProductDetails(products: any[]) {
    const productRequests = products.map(p => this.http.get(`${this.baseUrl}/products/${p.productId}`));

    forkJoin(productRequests).subscribe(productDetails => {
      const enrichedProducts = products.map((p, index) => ({
        ...p,
        ...productDetails[index]
      }));
      this.cartItems.next(enrichedProducts);
    });
  }

  // ➕ Thêm sản phẩm vào giỏ hàng
  addToCart(productId: number, quantity: number = 1) {
    let currentCart = this.cartItems.value;
    let existingProduct = currentCart.find(p => p.id === productId);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      this.http.get(`${this.baseUrl}/products/${productId}`).subscribe(product => {
        currentCart.push({ ...product, quantity });
        this.cartItems.next([...currentCart]);
      });
    }

    if (this.cartId) {
      this.updateCart(currentCart);
    } else {
      this.createCart(currentCart);
    }
  }

  private updateCart(products: any[]) {
    this.http.put(`${this.baseUrl}/carts/${this.cartId}`, {
      userId: this.userId,
      date: new Date(),
      products: products.map(p => ({ productId: p.id, quantity: p.quantity }))
    }).subscribe();
  }

  private createCart(products: any[]) {
    this.http.post(`${this.baseUrl}/carts`, {
      userId: this.userId,
      date: new Date(),
      products: products.map(p => ({ productId: p.id, quantity: p.quantity }))
    }).subscribe((cart: any) => {
      this.cartId = cart.id;
    });
  }

  deleteProduct(productId: number) {
    this.http.delete(`${this.baseUrl}/products/${productId}`).subscribe(response => {
      console.log('Deleted product:', response);
    });
    
  }
  
  
}
