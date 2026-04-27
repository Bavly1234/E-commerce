import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { AuthService } from '../../core/auth/services/auth.service';
import { CartService } from '../../core/auth/services/cart.service';
import { ProductsService } from '../../core/services/products.service';

import { Cart } from './models/cart.interface';
import { product } from '../../core/models/product.interface';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly toastr = inject(ToastrService);
  private readonly productsService = inject(ProductsService);

  cartDetails = signal<Cart | null>(null);
  isLoading = signal<boolean>(true);
  isLoggedIn = signal<boolean>(false);

  guestCartProducts = signal<{ product: product; count: number }[]>([]);

  ngOnInit(): void {
    this.isLoggedIn.set(this.authService.isAuthenticated());

    if (this.isLoggedIn()) {
      this.getCartItems();
    } else {
      this.loadGuestCartProducts();
    }
  }

  getCartItems(): void {
    this.isLoading.set(true);

    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        this.cartDetails.set(res.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.toastr.error('Failed to load cart');
      },
    });
  }

  loadGuestCartProducts(): void {
    const ids = this.cartService.getGuestCart();

    if (ids.length === 0) {
      this.isLoading.set(false);
      return;
    }

    forkJoin(
      ids.map((id) => this.productsService.getSpecificProduct(id))
    ).subscribe({
      next: (results) => {
        this.guestCartProducts.set(
          results.map((res) => ({
            product: res.data,
            count: 1,
          }))
        );

        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  updateCount(productId: string, count: number): void {
    if (count < 1) return;

    this.cartService.updateCartItem(productId, count).subscribe({
      next: (res) => {
        this.cartDetails.set(res.data);
        this.toastr.success('Cart updated!');
      },
      error: () => {
        this.toastr.error('Failed to update cart');
      },
    });
  }

  removeItem(productId: string): void {
    this.cartService.removeCartItem(productId).subscribe({
      next: (res) => {
        this.cartDetails.set(res.data);
        this.cartService.cartCount.set(res.numOfCartItems);
        this.toastr.success('Item removed from cart');
      },
      error: () => {
        this.toastr.error('Failed to remove item');
      },
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: (res) => {
        this.cartDetails.set(null);
        this.cartService.cartCount.set(res.numOfCartItems);
        this.toastr.success('Cart cleared!');
      },
      error: () => {
        this.toastr.error('Failed to clear cart');
      },
    });
  }

  removeGuestItem(index: number): void {
    const ids = this.cartService.getGuestCart();
    ids.splice(index, 1);

    localStorage.setItem('guestCart', JSON.stringify(ids));

    const items = [...this.guestCartProducts()];
    items.splice(index, 1);

    this.guestCartProducts.set(items);
    this.toastr.success('Item removed');
  }

  updateGuestCount(index: number, delta: number): void {
    const items = [...this.guestCartProducts()];
    const newCount = items[index].count + delta;

    if (newCount < 1) return;

    items[index] = {
      ...items[index],
      count: newCount,
    };

    this.guestCartProducts.set(items);
  }

  getGuestTotal(): number {
    return this.guestCartProducts().reduce(
      (sum, item) => sum + item.product.price * item.count,
      0
    );
  }
}