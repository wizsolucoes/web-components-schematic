import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, switchMap } from 'rxjs/operators';
import { getDataStorage, WcoEventsService } from '../../public-api';

/**
 * Interceptor responsável por adicionar o cabeçalho 'x-tenant' e o token de autorização nas requisições HTTP.
 */
@Injectable()
export class WcoTenantInterceptor2 implements HttpInterceptor {
  private wcoEvent = inject(WcoEventsService);
  private exec = false;

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
    const modifiedRequest = this.addTenantHeader(request);
    const auth = getDataStorage('', 'w-auth');

    if (auth) {
      const token = auth.hash;
      if (token) {
        const { refresh_token, expire_date } = auth;
        const expires_in = new Date(expire_date);
        const currentDateTime = new Date();

        request = this.addAuthToken(modifiedRequest, token);

        if (!this.exec && refresh_token && expires_in <= currentDateTime) {
          this.exec = true;
          this.wcoEvent.emitEvent('refreshToken', {});

          // Atrasar a requisição por 3 segundos
          return of(null).pipe(
            delay(3000),
            switchMap(() => {
              const newToken = getDataStorage('hash', 'w-auth');
              request = this.addAuthToken(modifiedRequest, newToken);
              return next.handle(request).pipe(catchError(this.handleError));
            })
          );
        }
      }
    }

    return next.handle(request).pipe(catchError(this.handleError));
  }

  /**
   * Adiciona o cabeçalho 'x-tenant' à requisição HTTP.
   * @param request A requisição HTTP.
   * @returns A requisição HTTP modificada com o cabeçalho 'x-tenant'.
   */
  private addTenantHeader(request: HttpRequest<any>): HttpRequest<any> {
    const tenant = getDataStorage('tenant', 'w-theme') || '';
    return request.clone({
      setHeaders: {
        'x-tenant': tenant,
      },
    });
  }

  /**
   * Adiciona o token de autorização à requisição HTTP.
   * @param request A requisição HTTP.
   * @param token O token de autorização.
   * @returns A requisição HTTP modificada com o cabeçalho de autorização.
   */
  private addAuthToken(
    request: HttpRequest<any>,
    token: string
  ): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  /**
   * Lida com erros de requisição HTTP.
   * @param error O erro HTTP.
   * @returns Um Observable que emite o erro.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status == 401) {
      this.wcoEvent.emitEvent('refreshToken', {});
    }
    return throwError(() => error);
  }
}
