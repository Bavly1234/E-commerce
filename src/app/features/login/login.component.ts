import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../core/auth/services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/auth/services/cart.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);
  private readonly toastr = inject(ToastrService);

  isLoading = signal<boolean>(false);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]],
  });

  submitForm(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);

      this.authService.signIn(this.loginForm.value).subscribe({
        next: (res) => {
          localStorage.setItem('freshToken', res.token);
          localStorage.setItem('freshUser', JSON.stringify(res.user));
          this.authService.isLogged.set(true);

          this.syncGuestCart();
        },
        error: (err) => {
          this.isLoading.set(false);
          this.toastr.error(err.error?.message || 'Login failed. Please try again.', 'Error');
        }
      });

    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  private syncGuestCart(): void {
    const guestCart = this.cartService.getGuestCart();

    if (guestCart.length === 0) {
      this.isLoading.set(false);
      this.router.navigate(['/']);
      this.toastr.success('Login successful!', 'Welcome Back');
      return;
    }

    forkJoin(guestCart.map(id => this.cartService.addToCart(id))).subscribe({
      next: () => {
        this.cartService.clearGuestCart();
        this.isLoading.set(false);
        this.router.navigate(['/']);
        this.toastr.success('Login successful! Your cart has been restored 🛒', 'Welcome Back');
      },
      error: () => {
        this.isLoading.set(false);
        this.router.navigate(['/']);
        this.toastr.success('Login successful!', 'Welcome Back');
      }
    });
  }
}