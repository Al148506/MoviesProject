import {
  HttpHandler,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { SecurityService } from './security.service';
import { inject } from '@angular/core';

export const authIterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const securityService = inject(SecurityService);
  const token = securityService.obtainToken();
  if(token){
    req = req.clone({
        setHeaders: {
            'Authorization':`Bearer ${token}`
        }
    })
  }
  return next(req);
}
