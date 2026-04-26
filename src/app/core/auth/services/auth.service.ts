import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly httpClient = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  isLogged = signal<boolean>(false);

  // ✅ logout
  logOut() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('freshToken');
      this.isLogged.set(false);
      this.router.navigate(['/login']);
    }
  }

  // ================= API =================

  signUp(data: object): Observable<any> {
    return this.httpClient.post(`${environment.baseurl}/api/v1/auth/signup`, data);
  }

  signIn(data: object): Observable<any> {
    return this.httpClient.post(`${environment.baseurl}/api/v1/auth/signin`, data);
  }

  forgotPassword(data: object): Observable<any> {
    return this.httpClient.post(`${environment.baseurl}/api/v1/auth/forgotPasswords`, data);
  }

  resetPassword(data: object): Observable<any> {
    return this.httpClient.put(`${environment.baseurl}/api/v1/auth/resetPassword`, data);
  }

  verifyCode(data: object): Observable<any> {
    return this.httpClient.post(`${environment.baseurl}/api/v1/auth/verifyResetCode`, data);
  }

  // ================= USER =================

  getUserId(): string | null {
    // ✅ الحل هنا
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const token = localStorage.getItem('freshToken');
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return decoded.id;
    } catch (err) {
      console.log('Invalid token', err);
      return null;
    }
  }

  // (اختياري بس مفيد جدًا)
  isAuthenticated(): boolean {
    return !!this.getUserId();
  }
}