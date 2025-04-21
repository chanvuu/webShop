import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { CartManagementComponent } from './components/cart-management/cart-management.component';  
import { StatisticsComponent } from './components/statistics/statistics.component';  

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'products',
        component: ProductListComponent,
      },
      {
        path: 'users',
        component: UserManagementComponent,
      },
      {
        path: 'carts',  // Đơn hàng
        component: CartManagementComponent,  
      },
      {
        path: 'statistics',  // Thống kê
        component: StatisticsComponent,  
      },
      { path: '', redirectTo: 'products', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/admin', pathMatch: 'full' },
];
