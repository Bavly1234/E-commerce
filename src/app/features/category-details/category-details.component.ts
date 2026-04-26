import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CategoriesService } from '../../core/services/categories.service';
import { Category } from '../cart/models/cart.interface';

@Component({
  selector: 'app-category-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.css',
})
export class CategoryDetailsComponent implements OnInit {

  // 🔥 inject
  private readonly route = inject(ActivatedRoute);
  private readonly categoriesService = inject(CategoriesService);

  // 💎 state
  category = signal<Category | null>(null);
  subCategories = signal<any[]>([]);
  isLoading = signal<boolean>(true);

  // 🎯 id
  categoryId = signal<string>('');

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id')!;

      this.categoryId.set(id);
      this.loadCategoryData(id);
    });
  }

  loadCategoryData(id: string): void {
    this.isLoading.set(true);

    this.categoriesService.getSpecificCategory(id).subscribe({
      next: (res) => {
        this.category.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.isLoading.set(false);
      }
    });

    // 🔥 لو عندك API للـ subcategories
    this.categoriesService.getSubCategories(id).subscribe({
      next: (res) => {
        console.log("The sub",res);
        
        this.subCategories.set(res.data);
      }
    });
  }

}