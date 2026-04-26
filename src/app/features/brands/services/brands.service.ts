import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {

  private readonly httpClient= inject(HttpClient)

  getAllBrands(){
    return this.httpClient.get(environment.baseurl+'/api/v1/brands')
  }

  getBrandById(id:string){
    return this.httpClient.get(environment.baseurl+`/api/v1/brands/${id}`)
  }

}
