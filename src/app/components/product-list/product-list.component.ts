import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  newProduct = {title: '', price: 0, description: '', image: 'https://via.placeholder.com/150', category: ''};
  editingProduct: any = null;
  isFormVisible: boolean = false;
  filteredProducts: any[] = [];
  searchText: string = '';
  selectedCategory: string = '';
  selectedPriceSortOrder: string = '';
  
  constructor(private productService: ProductService) {}

  categories: string[] = [
    "men's clothing",
    "women's clothing",
    'jewelery',
    'electronics'
  ];
  

  toggleForm(): void {
    this.isFormVisible = !this.isFormVisible; // Hiện/ẩn form modal
    if (!this.isFormVisible) {
      this.resetForm(); // Reset form khi đóng cửa sổ
    }
  }

  resetForm(): void {
    this.newProduct = { title: '', price: 0, description: '', image: 'https://via.placeholder.com/150', category: '' };
    this.editingProduct = null;
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  // 🛒 Lấy danh sách sản phẩm từ API
  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data;
        this.filteredProducts = data; // Đặt danh sách sản phẩm ban đầu là danh sách sản phẩm
      },
      (error) => console.error(" Lỗi khi tải sản phẩm:", error)
    );
  }

  // Lọc sản phẩm theo các tiêu chí
  filterProducts(): void {
    // Lọc theo tên sản phẩm và thể loại
    this.filteredProducts = this.products.filter(product => {
      const matchesSearchText = product.title.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesCategory = this.selectedCategory ? product.category.toLowerCase() === this.selectedCategory.toLowerCase() : true;

      return matchesSearchText && matchesCategory;
    });

    // Sắp xếp sản phẩm theo giá (tăng dần hoặc giảm dần)
    if (this.selectedPriceSortOrder === 'asc') {
      this.filteredProducts.sort((a, b) => a.price - b.price); // Tăng dần
    } else if (this.selectedPriceSortOrder === 'desc') {
      this.filteredProducts.sort((a, b) => b.price - a.price); // Giảm dần
    }
  }
  
  // Thêm sản phẩm mới
  addProduct(): void {
    if (!this.newProduct.title || !this.newProduct.price || !this.newProduct.image) {
      alert("Vui lòng nhập đầy đủ thông tin sản phẩm, bao gồm tên, giá, và hình ảnh!");
      return;
    }
  
    this.productService.addProduct(this.newProduct).subscribe({
      next: (data) => {
        console.log("✔ Sản phẩm đã được thêm:", data);
  
        // 🔧 Tự tạo id giả dựa trên sản phẩm hiện tại
        const newId = this.products.length > 0
          ? Math.max(...this.products.map(p => p.id)) + 1
          : 1;
  
        const productWithFakeId = {
          ...data,
          id: newId // ✅ Gán ID mới không trùng
        };
  
        this.products.push(productWithFakeId);
        this.filteredProducts = [...this.products]; // Cập nhật danh sách hiển thị
        this.resetForm();
        this.isFormVisible = false;
      },
      error: (error) => {
        console.error("Lỗi khi thêm sản phẩm:", error);
        this.isFormVisible = true;
      }
    });
  }
  

  // Bắt đầu chỉnh sửa sản phẩm
  editProduct(product: any): void {
    this.newProduct = { ...product };  
    this.editingProduct = product;    
    this.isFormVisible = true;        
  }

  // Cập nhật sản phẩm
  updateProduct(): void {
    if (!this.editingProduct) return;
  
    this.productService.updateProduct(this.editingProduct.id, this.newProduct).subscribe(
      (data) => {
        const index = this.products.findIndex(p => p.id === data.id);
        if (index !== -1) {
          this.products[index] = data; // Cập nhật danh sách sản phẩm
        }
        this.filteredProducts = [...this.products]; // Đồng bộ lại filteredProducts
        this.editingProduct = null; // Thoát chế độ chỉnh sửa
        this.isFormVisible = false; // Ẩn form
        this.resetForm(); // Reset form sau khi cập nhật
      },
      (error) => console.error("Lỗi khi cập nhật sản phẩm:", error)
    );
  }

  // Xóa sản phẩm
  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe(
      () => {
        this.products = this.products.filter(p => p.id !== id);
        this.filteredProducts = this.filteredProducts.filter(p => p.id !== id);  // Cập nhật filteredProducts để đồng bộ
      },
      (error) => console.error(" Lỗi khi xóa sản phẩm:", error)
    );
  }
}
