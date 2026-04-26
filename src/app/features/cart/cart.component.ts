// import { Component, inject, OnInit, signal } from '@angular/core';
// import { CartService } from '../../core/auth/services/cart.service';
// import { Cart } from './models/cart.interface';

// @Component({
//   selector: 'app-cart',
//   imports: [],
//   templateUrl: './cart.component.html',
//   styleUrl: './cart.component.css',
// })
// export class CartComponent implements OnInit {
//   private readonly cartService = inject(CartService)
//   cartDetails= signal<Cart>({} as Cart);

//   ngOnInit(): void {
// this.getCartItems();
//   }

//   getCartItems(): void {
//     this.cartService.getLoggedUserCart().subscribe({
//       next: (res) => this.cartDetails.set(res.data),
//     })
//   }

// }















































import { Component, inject, OnInit, signal } from '@angular/core';
import { CartService } from '../../core/auth/services/cart.service';
import { Cart, Product } from './models/cart.interface';
import { AuthService } from '../../core/auth/services/auth.service';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from '../../core/services/products.service';
import { forkJoin, of } from 'rxjs';
import { product } from '../../core/models/product.interface';

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

  // Guest cart — full product details
  guestCartProducts = signal<{ product: product; count: number }[]>([]);

  ngOnInit(): void {
    this.isLoggedIn.set(this.authService.isLogged());

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
      }
    });
  }

  // Fetch full product details for each guest cart ID
 loadGuestCartProducts(): void {
  const ids = this.cartService.getGuestCart();
  console.log('Guest IDs from localStorage:', ids);

  if (ids.length === 0) {
    this.isLoading.set(false);
    return;
  }

  forkJoin(ids.map(id => this.productsService.getSpecificProduct(id))).subscribe({
    next: (results) => {
      console.log('Results:', results);
      this.guestCartProducts.set(
        results.map(res => ({ product: res.data, count: 1 }))
      );
      this.isLoading.set(false);
    },
    error: (err) => {
      console.error('Error fetching guest products:', err);
      this.isLoading.set(false);
    }
  });
}

  updateCount(productId: string, count: number): void {
    if (count < 1) return;
    this.cartService.updateCartItem(productId, count).subscribe({
      next: (res) => {
        this.cartDetails.set(res.data);
        this.toastr.success('Cart updated!');
      },
      error: () => this.toastr.error('Failed to update cart')
    });
  }

  removeItem(productId: string): void {
    this.cartService.removeCartItem(productId).subscribe({
      next: (res) => {
        this.cartDetails.set(res.data);
        this.toastr.success('Item removed from cart');
        this.cartService.cartCount.set(res.numOfCartItems);
      },
      error: () => this.toastr.error('Failed to remove item')
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: (res) => {
        this.cartDetails.set(null);
        this.toastr.success('Cart cleared!');
        this.cartService.cartCount.set(res.numOfCartItems);

      },
      error: () => this.toastr.error('Failed to clear cart')
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

  // Increase/decrease guest item count locally
  updateGuestCount(index: number, delta: number): void {
    const items = [...this.guestCartProducts()];
    const newCount = items[index].count + delta;
    if (newCount < 1) return;
    items[index] = { ...items[index], count: newCount };
    this.guestCartProducts.set(items);
  }
getGuestTotal(): number {
    return this.guestCartProducts().reduce(
      (sum, item) => sum + item.product.price * item.count, 0
    );
  }
}


















