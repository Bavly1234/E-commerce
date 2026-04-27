import { Component, inject, OnInit, signal } from '@angular/core';
import { CategoriesService } from '../../core/services/categories.service';
import { Router, RouterLink } from '@angular/router';
import { Category } from '../cart/models/cart.interface';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
  imports: [RouterLink],
})
export class CategoriesComponent implements OnInit {

  private readonly categoriesService = inject(CategoriesService);
  private readonly router = inject(Router);


  categories = signal<Category[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.getCategories();
  }

  
  getCategories(): void {
    this.loading.set(true);

    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categories.set(res.data);
        this.loading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.error.set('Failed to load categories');
        this.loading.set(false);
      }
    });
  }

  goToCategory(categoryId: string): void {
    this.router.navigate(['/categories', categoryId]);
  }
}