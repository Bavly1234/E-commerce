import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { product } from '../../core/models/product.interface';

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly productsService= inject(ProductsService)
productDetails=signal<product>({} as product)

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {

      this.getProductDetails( params.get('id')!)
    })
  }
getProductDetails(id:string):void{
  this.productsService.getSpecificProduct(id).subscribe({
    next:(res)=>{
      console.log(res.data)
      this.productDetails.set(res.data  )
    }, error:(res)=>{
      console.log(res)

    }
  })
}

}
