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

  /**
   * Interceptor responsável por adicionar o cabeçalho 'x-tenant' e o token de autorização nas requisições HTTP.
   */
  @Injectable()
  export class WcoTenantInterceptor implements HttpInterceptor {
    constructor() {}

    /**
     * Intercepta a requisição HTTP e adiciona o cabeçalho 'x-tenant' e o token de autorização, se disponível.
     * Caso ocorra um erro de autenticação (status 401), redireciona o usuário para a página inicial.
     * @param request A requisição HTTP.
     * @param next O próximo manipulador de requisição na cadeia.
     * @returns Um Observable que emite o evento HTTP resultante.
     */
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
  