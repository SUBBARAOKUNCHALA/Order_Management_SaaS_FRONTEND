// auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { RegisterService } from '../register.service';
// import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: RegisterService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
  // Skip adding token for public auth routes
  if (req.url.includes('/auth/register') || req.url.includes('/auth/login')) {
    return next.handle(req);
  }

  const token = this.auth.getToken();
  console.log("token",token)
  if (!token) return next.handle(req);

  const cloned = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
  return next.handle(cloned);
}
}
