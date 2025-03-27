import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://fakestoreapi.com/products'; // API Fake Store

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      // Lọc bỏ electronics
      map((products) =>
        products
          .filter((p) => p.category !== 'electronics')
          // Sắp xếp theo thứ tự: men → women → jewelery
          .sort((a, b) => this.sortByCategory(a.category, b.category))
      )
    );
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  private sortByCategory(a: string, b: string): number {
    const order = ['men\'s clothing', 'women\'s clothing', 'jewelery'];
    return order.indexOf(a) - order.indexOf(b);
  }
}
