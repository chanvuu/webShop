import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme/theme.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-dashboard" [class.dark-theme]="themeService.isDarkTheme$ | async">
      <h2>Admin Dashboard</h2>
      <p>Welcome to the admin area!</p>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      padding: 20px;
      transition: all 0.3s ease;
    }
    
    .admin-dashboard.dark-theme {
      background-color: #333;
      color: white;
    }
    
    .admin-dashboard.dark-theme h2 {
      color: #40c463;
    }
  `]
})
export class AdminDashboardComponent {
  constructor(public themeService: ThemeService) {}
} 