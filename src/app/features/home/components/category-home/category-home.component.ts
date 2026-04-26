import { Component, inject, OnInit, signal } from '@angular/core';
import { CategoriesService } from '../../../../core/services/categories.service';
import { Category } from '../../../../core/models/category.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-home',
  imports: [RouterLink],
  templateUrl: './category-home.component.html',
  styleUrl: './category-home.component.css',
})
export class CategoryHomeComponent implements OnInit {
  ngOnInit(): void {
    this.getCategoriesData()
  }
  private readonly categoriesService = inject(CategoriesService)
categoryList= signal<Category[]>([])

  getCategoriesData(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        console.log("cat" ,res);
        this.categoryList.set(res.data)

      }
    })
  }
}
