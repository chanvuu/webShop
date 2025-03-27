import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product/product.service';
import { CartService } from '../../services/cart/cart.service';
import { Router } from '@angular/router';

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

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
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

  addToCart(productId: number) {
    this.cartService.addToCart(productId, 1); // Thêm 1 sản phẩm vào giỏ hàng
  }

  viewProductDetail(productId: number) {
    this.router.navigate(['/product', productId]);
  }
}
