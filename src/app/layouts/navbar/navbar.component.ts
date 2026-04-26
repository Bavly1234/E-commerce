import { isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FlowbiteService } from '../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../core/auth/services/auth.service';
import { CartService } from '../../core/auth/services/cart.service';
import { log } from 'node:console';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)
  private readonly cartService = inject(CartService)
  logged = computed(() => this.authService.isLogged());

  count = computed(()=>this.cartService.cartCount());

  private readonly platformId = inject(PLATFORM_ID); 

  constructor(private flowbiteService: FlowbiteService) { }

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });

    if (isPlatformBrowser(this.platformId)){
       
            this.getCartCount();

      if (localStorage.getItem('freshToken')) {
        this.authService.isLogged.set(true);
      }

    }
  }

  logOut() {
    this.authService.logOut();
  }

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
