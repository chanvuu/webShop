import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { map, take } from 'rxjs/operators';

export function adminGuard() {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isAdmin().pipe(
    take(1),
    map(isAdmin => {
      if (!isAdmin) {
        router.navigate(['/shop']);
        return false;
      }
      return true;
    })
  );
} 