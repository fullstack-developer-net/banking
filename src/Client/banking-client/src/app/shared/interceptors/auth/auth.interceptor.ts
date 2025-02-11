// auth-interceptor.service.ts
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppStateManager } from '../../app.state-manager';
 
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private appState:AppStateManager) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
 
    if (this.appState.token) {
      // Clone the request and add the Authorization header with the token
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${this.appState.token}`
        }
      });
      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}