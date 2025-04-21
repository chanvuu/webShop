import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'https://fakestoreapi.com/carts'; // Fake Store API
  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>('https://fakestoreapi.com/products');
  }
  
  getProductById(productId: number): Observable<any> {
    return this.http.get<any>(`https://fakestoreapi.com/products/${productId}`);
  }

  // Lấy danh sách đơn hàng
  getCarts(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Thêm đơn hàng
  addCart(cart: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, cart);
  }

  // Cập nhật đơn hàng
  updateCart(cartId: number, cart: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${cartId}`, cart);
  }

  // Xóa đơn hàng
  deleteCart(cartId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${cartId}`);
  }

}
