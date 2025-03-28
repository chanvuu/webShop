import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@gmail.com$')]],
      password: ['', [Validators.required, Validators.minLength(6)]]
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

  getEmailError() {
    const email = this.loginForm.get('email');
    if (email?.errors && (email.dirty || email.touched)) {
      if (email.errors['pattern'] || email.errors['required']) {
        return 'Vui lòng nhập lại gmail';
      }
    }
    return '';
  }

  getPasswordError() {
    const password = this.loginForm.get('password');
    if (password?.errors && (password.dirty || password.touched)) {
      if (password.errors['minlength'] || password.errors['required']) {
        return 'Mật khẩu phải có ít nhất 6 ký tự';
      }
    }
    return '';
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe({
        next: (response) => {
          this.router.navigate(['/shop']);
        },
        error: (error) => {
          this.errorMessage = 'Sai tài khoản hoặc mật khẩu';
          this.loginForm.patchValue({ 
            email: '',
            password: '' 
          });
        }
      });
    }
  }
} 