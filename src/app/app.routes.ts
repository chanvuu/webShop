import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProductComponent } from './components/product/product.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { AdminLayoutComponent } from './components/admin/admin-layout/admin-layout.component';
import { ProductListComponent } from './components/admin/product-list/product-list.component';
import { UserManagementComponent } from './components/admin/user-management/user-management.component';
import { CartManagementComponent } from './components/admin/cart-management/cart-management.component';  
import { StatisticsComponent } from './components/admin/statistics/statistics.component';  

export const routes: Routes = [
  { path: 'shop', component: ProductComponent },
  { path: 'cart', component: ProductComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [],
    children: [
      { path: 'products', component: ProductListComponent },
      { path: 'users', component: UserManagementComponent },
      { path: 'carts', component: CartManagementComponent },
      { path: 'statistics', component: StatisticsComponent },
      { path: '', redirectTo: 'products', pathMatch: 'full' },
    ],
  },

  { path: '', redirectTo: '/shop', pathMatch: 'full' }, 
  { path: '**', redirectTo: 'shop' },
];
