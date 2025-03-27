import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { CartService } from '../../services/cart/cart.service';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <button class="back-btn" (click)="goBack()">← Back to Products</button>
      
      <div class="product-detail" *ngIf="product; else loading">
        <div class="product-image">
          <img [src]="product.image" [alt]="product.title">
        </div>
        <div class="product-info">
          <h1>{{ product.title }}</h1>
          <p class="category">{{ product.category }}</p>
          <p class="price">{{ product.price | currency }}</p>
          <p class="description">{{ product.description }}</p>
          <button class="add-to-cart-btn" (click)="addToCart(product.id)">Add to Cart</button>
        </div>
      </div>

      <ng-template #loading>
        <div class="loading">
          <p>Loading product details...</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      background-color: white;
      min-height: calc(100vh - 64px);
    }
    .back-btn {
      margin-bottom: 2rem;
      padding: 0.5rem 1rem;
      background-color: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.3s ease;
    }
    .back-btn:hover {
      background-color: #e9ecef;
    }
    .product-detail {
      display: flex;
      gap: 3rem;
      background-color: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .product-image {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: white;
      padding: 1rem;
      border-radius: 8px;
    }
    .product-image img {
      max-width: 100%;
      max-height: 400px;
      height: auto;
      object-fit: contain;
      border-radius: 8px;
    }
    .product-info {
      flex: 1;
      padding: 1rem;
    }
    .product-info h1 {
      margin-bottom: 1rem;
      font-size: 2rem;
      color: #2c3e50;
      line-height: 1.2;
    }
    .category {
      color: #666;
      margin-bottom: 1rem;
      font-size: 1.1rem;
      text-transform: capitalize;
    }
    .price {
      font-size: 1.8rem;
      color: #2c3e50;
      margin-bottom: 1.5rem;
      font-weight: bold;
    }
    .description {
      line-height: 1.6;
      margin-bottom: 2rem;
      color: #666;
      font-size: 1.1rem;
    }
    .add-to-cart-btn {
      padding: 1rem 2rem;
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1.1rem;
      transition: all 0.3s ease;
      width: 100%;
    }
    .add-to-cart-btn:hover {
      background-color: #2980b9;
      transform: translateY(-2px);
    }
    .loading {
      text-align: center;
      padding: 4rem;
      font-size: 1.2rem;
      color: #666;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.router.navigate(['/']);
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  addToCart(productId: number) {
    this.cartService.addToCart(productId, 1);
    alert('Product added to cart!');
  }
} 