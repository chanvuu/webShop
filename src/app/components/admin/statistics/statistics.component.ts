import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Import để dùng currency pipe
import { StatisticsService } from '../../../services/admin/statistics/statistics.service';

@Component({
  selector: 'app-statistics',
  standalone: true, // ✅ Đây là điểm khác biệt
  imports: [CommonModule], // ✅ Bắt buộc để dùng currency pipe
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  totalRevenue: number = 0;
  totalUsers: number = 0;
  totalOrders: number = 0;
  totalProducts: number = 0;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.statisticsService.getAllOrders().subscribe(orders => {
      this.totalOrders = orders.length;
      this.calculateRevenue(orders);
    });

    this.statisticsService.getAllUsers().subscribe(users => {
      this.totalUsers = users.length;
    });

    this.statisticsService.getAllProducts().subscribe(products => {
      this.totalProducts = products.length;
    });
  }

  calculateRevenue(orders: any[]): void {
    this.statisticsService.getAllProducts().subscribe(products => {
      const productMap = new Map<number, number>();
      products.forEach(p => productMap.set(p.id, p.price));

      this.totalRevenue = orders.reduce((sum, order) => {
        return sum + order.products.reduce((subtotal: number, item: any) => {
          const price = productMap.get(item.productId) || 0;
          return subtotal + price * item.quantity;
        }, 0);
      }, 0);
    });
  }
}