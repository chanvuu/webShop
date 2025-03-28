import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-register',
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
          <h2>REGISTER FORM</h2>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
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

            <div class="form-group">
              <input 
                type="password" 
                formControlName="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                [class.error]="isFieldInvalid('confirmPassword')">
              <div class="error-message" *ngIf="isFieldInvalid('confirmPassword')">
                {{ getErrorMessage('confirmPassword') }}
              </div>
            </div>

            <div class="error-message register-error" *ngIf="errorMessage">
              {{ errorMessage }}
            </div>

            <button type="submit" class="login-btn" [disabled]="registerForm.invalid">
              Register
            </button>
            
            <div class="register-link">
              <p>Already have an account? <a routerLink="/login">Login here</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9._-]+@gmail.com$')
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('^[0-9]*$')
      ]],
      confirmPassword: ['', [
        Validators.required
      ]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.registerForm.get(fieldName);
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
      if (fieldName === 'confirmPassword') {
        if (this.registerForm.hasError('mismatch')) {
          return 'Mật khẩu không khớp';
        }
      }
    }
    return '';
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;
      this.authService.register(email, password).subscribe({
        next: () => {
          // Hiển thị thông báo đăng ký thành công
          alert('Đăng ký thành công! Vui lòng đăng nhập.');
          this.router.navigate(['/login']);
        },
        error: (error: { message: string }) => {
          this.errorMessage = error.message;
        }
      });
    } else {
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }
} 