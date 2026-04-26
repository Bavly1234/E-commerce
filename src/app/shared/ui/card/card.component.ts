import { Component, inject, input, signal, effect, OnInit, PLATFORM_ID } from '@angular/core';
import { product } from '../../../core/models/product.interface';
import { RouterLink } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/auth/services/auth.service';
import { CartService } from '../../../core/auth/services/cart.service';
import { NgClass, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-card',
  imports: [RouterLink, NgClass],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent implements OnInit {

  product = input.required<product>();

  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly toastr = inject(ToastrService);
  private readonly platformId = inject(PLATFORM_ID);

  isLoved = signal<boolean>(false);

  constructor() {
    effect(() => {
      const loved = this.isLoved();
      const productId = this.product().id;

      // ✅ حماية SSR
      if (productId && isPlatformBrowser(this.platformId)) {
        this.saveWishlistState(productId, loved);
      }
    });
  }

  ngOnInit(): void {
    this.loadWishlistState();
  }

  private loadWishlistState(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const productId = this.product().id;
    const wishlistItems = JSON.parse(localStorage.getItem('wishlist') || '[]');

    this.isLoved.set(wishlistItems.includes(productId));
  }

  private saveWishlistState(productId: string, isLoved: boolean): void {
    if (!isPlatformBrowser(this.platformId)) return;

    let wishlistItems = JSON.parse(localStorage.getItem('wishlist') || '[]');

    if (isLoved) {
      if (!wishlistItems.includes(productId)) {
        wishlistItems.push(productId);
      }
    } else {
      wishlistItems = wishlistItems.filter((id: string) => id !== productId);
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }

  getStars(rating: number): string[] {
    const stars: string[] = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push('fas fa-star');
      } else if (i === fullStars && hasHalf) {
        stars.push('fas fa-star-half-alt');
      } else {
        stars.push('far fa-star');
      }
    }
    return stars;
  }

  addToCart(productId: string): void {
    if (!this.authService.isLogged()) {
      this.cartService.addToGuestCart(productId);
      this.toastr.info('Item saved! Login to complete your order.', 'Saved Locally');
      return;
    }

    this.cartService.addToCart(productId).subscribe({
      next: (res) => {
        this.toastr.success('Added to cart successfully!', 'Cart');
        this.cartService.cartCount.set(res.numOfCartItems);
      },
      error: () => this.toastr.error('Failed to add to cart', 'Error')
    });
  }

  toggleWishlist(productId: string): void {
    if (this.isLoved()) {
      this.cartService.removeFromWishlist(productId).subscribe({
        next: () => {
          this.isLoved.set(false);
          this.toastr.info('Removed from wishlist', 'Wishlist');
        },
        error: () => this.toastr.error('Failed to remove from wishlist', 'Error')
      });
    } else {
      this.cartService.addToWishlist(productId).subscribe({
        next: () => {
          this.isLoved.set(true);
          this.toastr.success('Added to wishlist!', 'Wishlist');
        },
        error: () => this.toastr.error('Failed to add to wishlist', 'Error')
      });
    }
  }
}