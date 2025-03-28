import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="login-page">
      <div class="login-container">
        <div class="left-side">
          <h1>OFFICIAL</h1>
          <p>Lorem Ipsum Dolor Sit Amet</p>
        </div>
        <div class="right-side">
          <h2>OFFICIAL LOGIN FORM</h2>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <input 
                type="email" 
                formControlName="email"
                placeholder="example@gmail.com"
                [class.error]="isFieldInvalid('email')">
              <div class="error-message" *ngIf="isFieldInvalid('email')">
                {{ getErrorMessage('email') }}
              </div>
            </div>

            <div class="form-group">
              <input 
                type="password" 
                formControlName="password"
                placeholder="Nhập 6 số"
                [class.error]="isFieldInvalid('password')">
              <div class="error-message" *ngIf="isFieldInvalid('password')">
                {{ getErrorMessage('password') }}
              </div>
            </div>

            <button type="submit" class="login-btn" [disabled]="loginForm.invalid">Login</button>
            
            <div class="register-link">
              <p>Don't have an account? <a routerLink="/register">Register now</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      width: 100%;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #1a1a1a;
    }

    .login-container {
      width: 100%;
      max-width: 1000px;
      margin: 20px;
      display: flex;
      background: #2a2a2a;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    }

    .left-side {
      width: 45%;
      padding: 60px 40px;
      background: linear-gradient(135deg, #3a3a3a, #2a2a2a);
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .left-side h1 {
      color: white;
      font-size: 48px;
      margin-bottom: 20px;
    }

    .left-side p {
      color: #cccccc;
      font-size: 18px;
      line-height: 1.6;
    }

    .right-side {
      width: 55%;
      padding: 60px 40px;
      background: #2a2a2a;
    }

    .right-side h2 {
      color: white;
      font-size: 24px;
      margin-bottom: 40px;
      text-align: center;
    }

    .form-group {
      margin-bottom: 30px;
      position: relative;
    }

    input {
      width: 100%;
      padding: 12px;
      background: transparent;
      border: none;
      border-bottom: 2px solid #555;
      color: white;
      font-size: 16px;
      transition: all 0.3s ease;
    }

    input::placeholder {
      color: #666;
    }

    input:focus {
      outline: none;
      border-bottom-color: #2196F3;
    }

    input.error {
      border-bottom-color: #ff4444;
    }

    .error-message {
      position: absolute;
      left: 0;
      bottom: -20px;
      color: #ff4444;
      font-size: 12px;
      opacity: 0;
      transform: translateY(-10px);
      transition: all 0.3s ease;
    }

    .error-message:not(:empty) {
      opacity: 1;
      transform: translateY(0);
    }

    .login-btn {
      width: 100%;
      padding: 12px;
      background: #2196F3;
      color: white;
      border: none;
      border-radius: 25px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-top: 40px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .login-btn:disabled {
      background: #555;
      cursor: not-allowed;
    }

    .login-btn:not(:disabled):hover {
      background: #1976D2;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(33, 150, 243, 0.3);
    }

    .register-link {
      text-align: center;
      margin-top: 30px;
    }

    .register-link p {
      color: #888;
    }

    .register-link a {
      color: #2196F3;
      text-decoration: none;
      font-weight: bold;
      transition: all 0.3s ease;
    }

    .register-link a:hover {
      color: #1976D2;
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .login-container {
        flex-direction: column;
        margin: 0;
        border-radius: 0;
      }

      .left-side,
      .right-side {
        width: 100%;
        padding: 40px 20px;
      }

      .left-side {
        text-align: center;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9._-]+@gmail.com$')
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('^[0-9]*$')
      ]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.loginForm.get(fieldName);
    if (control) {
      if (control.hasError('required')) {
        return `${fieldName === 'email' ? 'Email' : 'Mật khẩu'} là bắt buộc`;
      }
      if (fieldName === 'email') {
        if (control.hasError('email')) {
          return 'Email không đúng định dạng';
        }
        if (control.hasError('pattern')) {
          return 'Email phải có dạng example@gmail.com';
        }
      }
      if (fieldName === 'password') {
        if (control.hasError('minlength')) {
          return 'Mật khẩu phải có ít nhất 6 ký tự';
        }
        if (control.hasError('pattern')) {
          return 'Mật khẩu phải chứa chỉ số';
        }
      }
    }
    return '';
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: () => {
          // Chuyển hướng được xử lý trong AuthService
        },
        error: (error) => {
          this.loginError = error.message;
        }
      });
    } else {
      // Đánh dấu tất cả các trường là đã touched để hiển thị lỗi
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }
} 