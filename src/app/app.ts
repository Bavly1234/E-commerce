import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { NgxSpinnerComponent } from "ngx-spinner";
import { CartService } from './core/auth/services/cart.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, NgxSpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Ecommerce');
  private readonly cartService = inject(CartService);

    getCartCount() : void{
  
      this.cartService.getLoggedUserCart().subscribe({
        next: (res) => {
          console.log(res, "im the navbar");
          
          this.cartService.cartCount.set(res.numOfCartItems);
          console.log(this.cartService.cartCount(), "im the count in navbar");
  
          
        }
          }
        );
  
    }
}
