import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent
  ],
  template: `
    <app-header *ngIf="!hideHeader && !isAdminPage"></app-header>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  hideHeader = false;
  isAdminPage = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Ẩn header ở trang login, register và admin
      this.hideHeader = event.urlAfterRedirects === '/login' || 
                       event.urlAfterRedirects === '/register';
      this.isAdminPage = event.urlAfterRedirects.startsWith('/admin');
      console.log('URL sau redirect:', event.urlAfterRedirects);
    });
  }
}