import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
  } from '@angular/common/http';
  import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { getDataStorage } from '../../utils/token.storage';

  @Injectable()
  export class WcoTenantInterceptor implements HttpInterceptor {
    constructor() {}
    intercept(
      request: HttpRequest<any>,
      next: HttpHandler
    ): Observable<HttpEvent<any>> {
      const auth = getDataStorage('', 'w-auth');
      const token = auth ? auth.hash : '';
  
      request = request.clone({
        setHeaders: {
          'x-tenant': getDataStorage('tenant', 'w-theme')
        },
      });
      if (token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status == 401) {
            window.location.href = '/';
          }
          return throwError(() => error);
        })
      );
    }
  }
  