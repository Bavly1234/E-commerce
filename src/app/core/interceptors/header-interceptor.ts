import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { read } from 'fs';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {

const pLATFORM_ID= inject(PLATFORM_ID)
if(isPlatformBrowser(pLATFORM_ID)){
  if(localStorage.getItem('freshToken') != null){
  req = req.clone({
    setHeaders: {
token : localStorage.getItem('freshToken')!   }
  });
}  
}

  return next(req);
};
