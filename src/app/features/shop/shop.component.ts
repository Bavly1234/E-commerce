import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { product } from '../../core/models/product.interface';
import { CardComponent } from "../../shared/ui/card/card.component";
import {NgxPaginationModule} from 'ngx-pagination'; 

@Component({
  selector: 'app-shop',
  imports: [CardComponent,NgxPaginationModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent implements OnInit {
private readonly productsService = inject(ProductsService);
  productList = signal<product[]>([]);

pageSize=signal<number>(0);
currentPage=signal<number>(0);
total=signal<number>(0);

ngOnInit(): void {
    this.getProductsData();
  }


  getProductsData(): void {
    this.productsService.getAllProducts().subscribe({
      next: (res) => {
        console.log(res.data);
        this.productList.set(res.data)

        this.pageSize.set(res.metadata.limit);
        this.currentPage.set(res.metadata.currentPage);
        this.total.set(res.results)
        ;},
    });
  }

  pageChanged(page: number):void {
    this.productsService.getAllProducts(page).subscribe({
      next: (res) => {
        console.log(res.data);
        this.productList.set(res.data)

        this.pageSize.set(res.metadata.limit);
        this.currentPage.set(res.metadata.currentPage);
        this.total.set(res.results)
        ;},
    });
  }
}

