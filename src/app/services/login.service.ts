import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginModalSubject = new Subject<boolean>();
  loginModal$ = this.loginModalSubject.asObservable();

  openLoginModal() {
    this.loginModalSubject.next(true);
  }

  closeLoginModal() {
    this.loginModalSubject.next(false);
  }
} 