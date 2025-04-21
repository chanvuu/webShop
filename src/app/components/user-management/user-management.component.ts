import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';  // Thêm service giả lập
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchText: string = '';
  isModalOpen: boolean = false;
  isEditing: boolean = false; // Biến kiểm tra đang sửa hay thêm

  // Dữ liệu thêm người dùng
  newUser: { id?: number; username: string; email: string; password: string } = {
    username: '',
    email: '',
    password: ''
  };

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();  // Load người dùng từ API khi khởi động
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data;
        this.filteredUsers = data;
      },
      (error) => console.error("Lỗi khi tải người dùng:", error)
    );
  }

  filterUsers(): void {
    if (this.searchText) {
      this.filteredUsers = this.users.filter(user =>
        user.username.toLowerCase().includes(this.searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.filteredUsers = this.users;
    }
  }

  deleteUser(userId: number): void {
    this.userService.deleteUser(userId).subscribe(
      () => {
        this.users = this.users.filter(user => user.id !== userId);
        this.filteredUsers = this.filteredUsers.filter(user => user.id !== userId);
      },
      (error) => console.error("Lỗi khi xóa người dùng:", error)
    );
  }

  editUser(user: any): void {
    this.isEditing = true;
    this.newUser = { ...user };  // Sao chép dữ liệu người dùng vào newUser
    this.isModalOpen = true;
  }

  openAddUserModal(): void {
    this.isEditing = false;
    this.newUser = { username: '', email: '', password: '' };  // Reset form để thêm người dùng mới
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.newUser = { username: '', email: '', password: '' }; // Reset dữ liệu sau khi đóng modal
  }

  addUser(): void {
    if (!this.newUser.username || !this.newUser.email || !this.newUser.password) {
      alert("Vui lòng nhập đầy đủ thông tin người dùng!");
      return;
    }
  
    this.userService.addUser(this.newUser).subscribe(
      (response) => {
        // FakeStoreAPI không trả về ID tăng dần thật → tự tạo ID tiếp theo
        const newId = this.users.length ? Math.max(...this.users.map(u => u.id || 0)) + 1 : 1;
  
        const addedUser = {
          ...this.newUser,
          id: newId
        };
  
        this.users.push(addedUser);
        this.filteredUsers = [...this.users];
        this.closeModal();
      },
      (error) => {
        console.error("Lỗi khi thêm người dùng:", error);
        alert("Có lỗi khi thêm người dùng.");
      }
    );
  }
  

  updateUser(): void {
    if (!this.newUser.id) {
      alert("Không có ID người dùng để cập nhật");
      return;  // Dừng nếu không có ID
    }

    this.userService.updateUser(this.newUser.id, this.newUser).subscribe(
      (updatedUser) => {
        const index = this.users.findIndex(user => user.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;  // Cập nhật người dùng trong users
          this.filteredUsers[index] = updatedUser;  // Cập nhật trong filteredUsers
        }
        this.closeModal();
      },
      (error) => {
        console.error("Lỗi khi cập nhật người dùng:", error);
        alert("Có lỗi khi cập nhật người dùng.");
      }
    );
  }
}
