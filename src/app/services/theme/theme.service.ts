import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkThemeSubject = new BehaviorSubject<boolean>(false);
  isDarkTheme$ = this.isDarkThemeSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('isDarkTheme');
      this.isDarkThemeSubject.next(savedTheme === 'true');
      this.updateBodyClass(savedTheme === 'true');
    }
  }

  toggleTheme() {
    const newTheme = !this.isDarkThemeSubject.value;
    this.isDarkThemeSubject.next(newTheme);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('isDarkTheme', newTheme.toString());
      this.updateBodyClass(newTheme);
    }
  }

  private updateBodyClass(isDark: boolean) {
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
} 