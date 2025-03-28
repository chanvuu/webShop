import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { tap, map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Role } from '../../models/role';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_email';
  private readonly USER_ROLE_KEY = 'user_role';
  private readonly REGISTERED_USERS_KEY = 'registered_users';
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private userEmailSubject = new BehaviorSubject<string>('');
  private userRoleSubject = new BehaviorSubject<Role>(Role.USER);
  
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  userEmail$ = this.userEmailSubject.asObservable();
  userRole$ = this.userRoleSubject.asObservable();

  // Tài khoản cố định để test
  private readonly TEST_EMAIL = 'test@gmail.com';
  private readonly TEST_PASSWORD = '123456';

  // Admin mặc định
  private readonly ADMIN_EMAIL = 'admin@gmail.com';
  private readonly ADMIN_PASSWORD = '123456';

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.checkInitialAuth();
      this.initializeAdmin();
    }
  }

  private initializeAdmin() {
    const users = this.getRegisteredUsers();
    if (!users.some(user => user.email === this.ADMIN_EMAIL)) {
      this.saveRegisteredUser(this.ADMIN_EMAIL, this.ADMIN_PASSWORD, Role.ADMIN);
    }
  }

  // Thêm phương thức để lấy danh sách users đã đăng ký
  private getRegisteredUsers(): Array<{email: string, password: string, role: Role}> {
    if (isPlatformBrowser(this.platformId)) {
      const users = localStorage.getItem(this.REGISTERED_USERS_KEY);
      return users ? JSON.parse(users) : [];
    }
    return [];
  }

  // Thêm phương thức để lưu user mới
  private saveRegisteredUser(email: string, password: string, role: Role = Role.USER): void {
    if (isPlatformBrowser(this.platformId)) {
      const users = this.getRegisteredUsers();
      users.push({ email, password, role });
      localStorage.setItem(this.REGISTERED_USERS_KEY, JSON.stringify(users));
    }
  }

  register(email: string, password: string): Observable<any> {
    // Validate email format
    if (!email.includes('@') || !email.includes('gmail.com')) {
      return new Observable(observer => {
        observer.error({ message: 'Email phải có định dạng @gmail.com' });
      });
    }

    // Validate password length
    if (password.length < 6) {
      return new Observable(observer => {
        observer.error({ message: 'Mật khẩu phải có ít nhất 6 ký tự' });
      });
    }

    const users = this.getRegisteredUsers();
    if (users.some(user => user.email === email)) {
      return new Observable(observer => {
        observer.error({ message: 'Email đã được đăng ký' });
      });
    }

    this.saveRegisteredUser(email, password, Role.USER);
    return of({ 
      success: true,
      message: 'Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.'
    });
  }

  login(email: string, password: string): Observable<any> {
    // Validate email format
    if (!email.includes('@') || !email.includes('gmail.com')) {
      return new Observable(observer => {
        observer.error({ message: 'Email phải có định dạng @gmail.com' });
      });
    }

    // Validate password length
    if (password.length < 6) {
      return new Observable(observer => {
        observer.error({ message: 'Mật khẩu phải có ít nhất 6 ký tự' });
      });
    }

    const users = this.getRegisteredUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return new Observable(observer => {
        observer.error({ message: 'Email hoặc mật khẩu không chính xác' });
      });
    }

    const mockResponse = {
      token: 'fake-jwt-token',
      email: email,
      role: user.role
    };

    if (isPlatformBrowser(this.platformId)) {
      this.setToken(mockResponse.token);
      this.setUserEmail(email);
      this.setUserRole(user.role);
      this.isAuthenticatedSubject.next(true);
      this.userEmailSubject.next(email);
      this.userRoleSubject.next(user.role);
      this.router.navigate(['/shop']);
    }

    return of(mockResponse);
  }

  // Thêm phương thức refreshToken
  refreshToken(): Observable<any> {
    // Giả lập refresh token
    return of({
      token: 'new-fake-jwt-token'
    });
  }

  private checkInitialAuth(): void {
    setTimeout(() => {
      const hasToken = this.hasToken();
      const userEmail = this.getUserEmail();
      this.isAuthenticatedSubject.next(hasToken);
      if (userEmail) {
        this.userEmailSubject.next(userEmail);
      }
    }, 0);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.USER_ROLE_KEY);
    }
    this.isAuthenticatedSubject.next(false);
    this.userEmailSubject.next('');
    this.userRoleSubject.next(Role.USER);
    this.router.navigate(['/shop']);
  }

  private setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  private setUserEmail(email: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.USER_KEY, email);
    }
  }

  private getUserEmail(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.USER_KEY);
    }
    return null;
  }

  private hasToken(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  isAdmin(): Observable<boolean> {
    return this.userRole$.pipe(
      map((role: Role) => role === Role.ADMIN)
    );
  }

  private setUserRole(role: Role): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.USER_ROLE_KEY, role);
    }
  }

  private getUserRole(): Role {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.USER_ROLE_KEY) as Role || Role.USER;
    }
    return Role.USER;
  }
} 