import { Component, inject, OnInit, signal } from '@angular/core';
import { CartService } from '../../core/auth/services/cart.service';
import { CardComponent } from "../../shared/ui/card/card.component";

@Component({
  selector: 'app-wishlist',
  imports: [CardComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent implements OnInit{

    private readonly cartService = inject(CartService);
  wishlist = signal<any[]>([]);

  ngOnInit(): void {
this.getWishlist()
 }


 getWishlist() {
    this.cartService.getWishlist().subscribe({
      next: (res) => {
        // this.wishlist.set(res.data);
        // this.isLoading.set(false);
        console.log("Thw wishlist",res);
              this.wishlist.set(res.data);

        
      },
      error: (err) => {
        // console.log(err);
        // this.isLoading.set(false);
      }
    });
  }

removeItem(productId: string) {
  this.cartService.removeFromWishlist(productId).subscribe({
    next: () => {
      this.wishlist.update(items =>
        items.filter(p => p.id !== productId)
      );
    }
  })
    

}
}