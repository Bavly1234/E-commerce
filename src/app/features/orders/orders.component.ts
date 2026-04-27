import { Component, inject, OnInit, signal } from '@angular/core';
import { CartService } from '../../core/auth/services/cart.service';
import { AuthService } from '../../core/auth/services/auth.service';
import { DatePipe, NgClass, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
  imports: [NgClass, DatePipe, NgIf, RouterLink],
})
export class OrdersComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);

  orders = signal<any[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  userId = this.authService.getUserId()!;

  ngOnInit(): void {
    if (!this.userId) {
      this.error.set('User not authenticated. Please log in.');
      return;
    }
    this.getOrders();
  }

  getOrders(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.cartService.getOrders(this.userId).subscribe({
      next: (res) => {
        const ordersData = res?.data || res;
        this.orders.set(Array.isArray(ordersData) ? ordersData : []);
        this.isLoading.set(false);
        console.log('Orders loaded:', this.orders());
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.error.set('Failed to load orders. Please try again later.');
        this.isLoading.set(false);
      },
    });
  }

  getTotalItems(order: any): number {
    return order?.cartItems?.reduce((sum: number, item: any) => {
      return sum + item.count;
    }, 0);
  }

  getOrderStatus(order: any): string {
    if (order.isDelivered) return 'Delivered';
    if (order.isPaid) return 'Processing';
    return 'On the way';
  }
}
