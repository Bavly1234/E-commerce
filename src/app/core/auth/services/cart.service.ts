import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly httpclient = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly CART_KEY = 'guestCart';

  cartCount = signal<number>(0);

  addToCart(productId: string): Observable<any> {
    return this.httpclient.post(`${environment.baseurl}/api/v1/cart`, {
      productId,
    });
  }

  getLoggedUserCart(): Observable<any> {
    return this.httpclient.get(`${environment.baseurl}/api/v1/cart`);
  }

  updateCartItem(productId: string, count: number): Observable<any> {
    return this.httpclient.put(
      `${environment.baseurl}/api/v1/cart/${productId}`,
      { count }
    );
  }

  removeCartItem(productId: string): Observable<any> {
    return this.httpclient.delete(
      `${environment.baseurl}/api/v1/cart/${productId}`
    );
  }

  clearCart(): Observable<any> {
    return this.httpclient.delete(`${environment.baseurl}/api/v1/cart`);
  }

  addToGuestCart(productId: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const cart = this.getGuestCart();

      if (!cart.includes(productId)) {
        cart.push(productId);
        localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
      }
    }
  }

  getGuestCart(): string[] {
    if (isPlatformBrowser(this.platformId)) {
      return JSON.parse(localStorage.getItem(this.CART_KEY) || '[]');
    }

    return [];
  }

  clearGuestCart(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.CART_KEY);
    }
  }

  addToWishlist(productId: string): Observable<any> {
    return this.httpclient.post(`${environment.baseurl}/api/v1/wishlist`, {
      productId,
    });
  }

  removeFromWishlist(productId: string): Observable<any> {
    return this.httpclient.delete(
      `${environment.baseurl}/api/v1/wishlist/${productId}`
    );
  }

  getWishlist(): Observable<any> {
    return this.httpclient.get(`${environment.baseurl}/api/v1/wishlist`);
  }

  createCashOrder(cartId: string, data: any): Observable<any> {
    return this.httpclient.post(
      `${environment.baseurl}/api/v1/orders/${cartId}`,
      data
    );
  }

  createVisaOrder(cartId: string, data: any): Observable<any> {
    return this.httpclient.post(
      `${environment.baseurl}/api/v1/orders/checkout-session/${cartId}?url=${environment.url}`,
      data
    );
  }

  getOrders(userId: string): Observable<any> {
    return this.httpclient.get(
      `${environment.baseurl}/api/v1/orders/user/${userId}`
    );
  }
}