import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProductComponent } from './components/product/product.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { 
    path: 'shop', 
    component: ProductComponent
  },
  { 
    path: 'cart', 
    component: ProductComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'admin', 
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [authGuard, adminGuard]
  },
  { path: 'login', component: LoginComponent },  // trang đăng nhập riêng
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'shop', pathMatch: 'full' },  // Redirect trang chủ đến shop
  { path: '**', redirectTo: 'shop' }  // redirect về trang chủ nếu URL không hợp lệ
];
