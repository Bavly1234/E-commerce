import { Component, inject, OnInit, signal } from '@angular/core';
import { BrandsService } from './services/brands.service';
import { Brands } from './interface/brands.interface';
import { RouterLink } from "@angular/router";
import { ProductsService } from '../../core/services/products.service';
import { product } from '../../core/models/product.interface';
import { CardComponent } from "../../shared/ui/card/card.component";

@Component({
  selector: 'app-brands',
  imports: [RouterLink, CardComponent],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
export class BrandsComponent implements OnInit {
  ngOnInit(): void {
this.getAllBrands()
}
  private readonly brandsService = inject(BrandsService)
  private readonly productsService = inject(ProductsService)
brandList = signal<Brands[]>([] as Brands[]);
productList = signal<product[]>([] as product[]);

  getAllBrands(){
  this.brandsService.getAllBrands().subscribe({
    next:(res)=>{
      console.log(res)
      this.brandList.set((res as { data: Brands[] }).data)
    },
    error:(err)=>{
      console.log(err)
    }
  })
}

selectedBrandName = signal<string | null>(null);
isFiltered = signal(false);

filterByBrand(id: string, name: string) {
  this.selectedBrandName.set(name);
  this.isFiltered.set(true);

  this.productsService.getAllProducts(1, id).subscribe({
    next: (res) => {
      console.log(res);
      this.productList.set((res as { data: product[] }).data);

    },
    error: (err) => {
      console.log(err);
    }
  });
}

clearFilter() {
  this.isFiltered.set(false);
  this.selectedBrandName.set(null);

  this.productList.set([]); // يمسح المنتجات
}
}
