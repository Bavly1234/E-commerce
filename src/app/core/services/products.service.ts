import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly httpClient = inject(HttpClient)


  getAllProducts(pageNum: number = 1, brandId: string = ''): Observable<any> {
    let url = `${environment.baseurl}/api/v1/products?page=${pageNum}`;
    if (brandId) {
      url += `&brand=${brandId}`;
    }
    return this.httpClient.get(url);
  }
  
  getSpecificProduct(productId: string): Observable<any> {
    return this.httpClient.get(`${environment.baseurl}/api/v1/products/${productId}`);
  }
}
