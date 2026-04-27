import { isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

import { AuthService } from '../../core/auth/services/auth.service';
import { CartService } from '../../core/auth/services/cart.service';
import { FlowbiteService } from '../../core/services/flowbite.service';
import { CategoriesService } from '../../core/services/categories.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {

  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly categoriesService = inject(CategoriesService);

  logged = computed(() => this.authService.isLogged());
  count = computed(() => this.cartService.cartCount());

  categories = toSignal(
    this.categoriesService.getAllCategories().pipe(
      map((res: any) => res.data) 
    ),
    { initialValue: [] }
  );

  constructor(private flowbiteService: FlowbiteService) {}

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite(() => {
      initFlowbite();
    });

    if (!isPlatformBrowser(this.platformId)) return;

    if (localStorage.getItem('freshToken')) {
      this.authService.isLogged.set(true);
    }

    this.loadCartCount();
  }

  private loadCartCount(): void {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        this.cartService.cartCount.set(res.numOfCartItems);
      }
    });
  }

  logOut(): void {
    this.authService.logOut();
    this.router.navigate(['/login']);
  }
}