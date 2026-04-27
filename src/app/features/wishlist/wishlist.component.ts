import { Component, inject, OnInit, signal } from '@angular/core';
import { CartService } from '../../core/auth/services/cart.service';
import { CardComponent } from '../../shared/ui/card/card.component';

@Component({
  selector: 'app-wishlist',
  imports: [CardComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent implements OnInit {
  private readonly cartService = inject(CartService);

  wishlist = signal<any[]>([]);

  ngOnInit(): void {
    this.getWishlist();
  }

  getWishlist(): void {
    this.cartService.getWishlist().subscribe({
      next: (res) => {
        this.wishlist.set(res.data);
      },
      error: () => {},
    });
  }

  removeItem(productId: string): void {
    this.cartService.removeFromWishlist(productId).subscribe({
      next: () => {
        this.wishlist.update((items) =>
          items.filter((p) => p.id !== productId)
        );
      },
    });
  }
}