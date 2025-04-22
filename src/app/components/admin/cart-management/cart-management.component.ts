import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../services/admin/cart/cart.service';

@Component({
  selector: 'app-cart-management',
  standalone: true,
  templateUrl: './cart-management.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./cart-management.component.css']
})
export class CartManagementComponent implements OnInit {
  carts: any[] = [];
  newCart: any = { userId: 0, date: '', products: [] };  // Định dạng mới của cart
  editingCart: any = null;
  isFormVisible: boolean = false;
  filteredCarts: any[] = [];
  searchText: string = '';
  selectedCart: any = null; 
  selectedCartProducts: any[] = [];

  constructor(private cartService: CartService) {}

  products: any[] = [];

  ngOnInit(): void {
    this.loadCarts();
    this.loadProducts();
  }

  // Lấy danh sách đơn hàng
  loadCarts(): void {
    this.cartService.getCarts().subscribe(
      (data) => {
        this.carts = data;
        this.filteredCarts = data; // Đặt danh sách đơn hàng ban đầu là danh sách đơn hàng
      },
      (error) => console.error("Lỗi khi tải đơn hàng:", error)
    );
  }
  //Lấy danh sách sản phẩm
  loadProducts(): void {
    this.cartService.getAllProducts().subscribe(
      (data) => this.products = data,
      (error) => console.error("Lỗi khi tải sản phẩm:", error)
    );
  }
  
  // Lọc đơn hàng theo tên người dùng hoặc ID
  filterCarts(): void {
    this.filteredCarts = this.carts.filter(cart => 
      cart.userId.toString().includes(this.searchText) ||
      cart.date.includes(this.searchText)
    );
  }
  removeProductFromCart(index: number): void {
    this.newCart.products.splice(index, 1);
  }
  
  getProductTitleById(productId: number): string {
    const product = this.products.find(p => p.id === productId);
    return product ? product.title : 'Không rõ';    
  }
  
  getProductImageById(productId: number): string | null {
    const product = this.products.find(p => p.id === productId);
    return product ? product.image : null;
  }

  getProductPriceById(productId: number): number {
    const product = this.products.find(p => p.id === productId);
    return product ? product.price : 0;
  }
  
  newProduct: any = { productId: 0, quantity: 1 };  

  addProductToCart(): void {
    if (!this.newProduct.productId || this.newProduct.quantity <= 0) {
      alert("Vui lòng nhập ID sản phẩm và số lượng hợp lệ.");
      return;
    }

    this.newCart.products.push({ ...this.newProduct });
    this.newProduct = { productId: 0, quantity: 1 };  // Reset
  }

  // Thêm đơn hàng
  addCart(): void {
    if (!this.newCart.userId || !this.newCart.date || !this.newCart.products.length) {
      alert("Vui lòng nhập đầy đủ thông tin đơn hàng!");
      return;
    }

    this.cartService.addCart(this.newCart).subscribe(
      (cart) => {
        // Lấy ID lớn nhất hiện tại
        const maxId = this.carts.length ? Math.max(...this.carts.map(c => c.id)) : 0;
  
        // Gán ID giả tạm thời cho đơn hàng mới
        const newCartWithId = { ...cart, id: maxId + 1 };
  
        this.carts.push(newCartWithId);
        this.filteredCarts = [...this.carts];
        this.resetForm();
        this.isFormVisible = false;
      },
      (error) => console.error("Lỗi khi thêm đơn hàng:", error)
    );
  }
  
  

  // Bắt đầu chỉnh sửa đơn hàng
  editCart(cart: any): void {
    this.newCart = { ...cart };  // Sao chép thông tin để chỉnh sửa
    this.editingCart = cart;
    this.isFormVisible = true;  // Hiển thị form
  }

  // Cập nhật đơn hàng
  updateCart(): void {
    if (!this.editingCart) return;

    this.cartService.updateCart(this.editingCart.id, this.newCart).subscribe(
      (data) => {
        const index = this.carts.findIndex(c => c.id === data.id);
        if (index !== -1) {
          this.carts[index] = data; // Cập nhật danh sách đơn hàng
        }
        this.filteredCarts = [...this.carts]; // Đồng bộ lại filteredCarts
        this.editingCart = null;  // Thoát chế độ chỉnh sửa
        this.isFormVisible = false;  // Ẩn form
        this.resetForm();  // Reset form
      },
      (error) => console.error("Lỗi khi cập nhật đơn hàng:", error)
    );
  }

  // Xóa đơn hàng
  deleteCart(id: number): void {
    this.cartService.deleteCart(id).subscribe(
      () => {
        this.carts = this.carts.filter(c => c.id !== id);
        this.filteredCarts = this.filteredCarts.filter(c => c.id !== id);  // Cập nhật filteredCarts để đồng bộ
      },
      (error) => console.error("Lỗi khi xóa đơn hàng:", error)
    );
  }

  // Reset form
  resetForm(): void {
    this.newCart = { userId: 0, date: '', products: [] };
    this.newProduct = { productId: 0, quantity: 1 };
    this.editingCart = null;
  }
  

  // Hiển thị chi tiết đơn hàng

  viewOrderDetails(cart: any): void {
    this.selectedCart = cart;
    this.selectedCartProducts = [];

    for (let item of cart.products) {
      this.cartService.getProductById(item.productId).subscribe(
        (productData: any) => {
          this.selectedCartProducts.push({
            ...productData,
            quantity: item.quantity
          });
        },
        (error: any) => console.error("Lỗi khi lấy sản phẩm:", error)
      );
    }
  }

  
  

  toggleForm(): void {
    this.isFormVisible = !this.isFormVisible;
    if (!this.isFormVisible) {
      this.resetForm();  // Reset form khi đóng
    }
  }
}