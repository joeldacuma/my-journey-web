import { Injectable, inject } from '@angular/core';
import { HttpEvent, 
         HttpInterceptor, 
         HttpHandler, 
         HttpRequest,
         HTTP_INTERCEPTORS,
         HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, map, lastValueFrom } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ROUTE_DASHBOARD, ROUTE_LOGIN, MY_JOURNEY_AUTH_CONSTANT } from '@constants/index';
import { AgendaService } from '@api/index';
import { LocalstorageService } from '@services/index';
import { DispatcherService, DispatcherDataService } from '@services/index';

export class httpInterceptorService implements HttpInterceptor {
  private router = inject(Router);
  private agendaService = inject(AgendaService);
  private localStorageService = inject(LocalstorageService);
  private dispatcherService = inject(DispatcherService);
  private isRefreshing = false;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        if (
           error.status = 412 &&
           error instanceof HttpErrorResponse &&
           !req.url.includes('authentication/signin')
        ) {
          return this.handle412Error(req, next);
        }

        return throwError(() => error);
      })
    );
  }

  private handle412Error(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
     this.isRefreshing = true;

     if (this.localStorageService.getItem(MY_JOURNEY_AUTH_CONSTANT)) {
      return this.agendaService.refreshAccessTokens().pipe(
        switchMap(() => {
          this.isRefreshing = false;
          return next.handle(req);
        }),
        catchError((error) => {
          this.isRefreshing = false;
          if ((error.status = 403) || (error.status = 417)) {
            this.dispatcherService.emit(new DispatcherDataService('logout', null));
          }
          return throwError(() => error);
        })
      )
     }
    }

    return next.handle(req);
  }
}
      
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: httpInterceptorService, multi: true },
];
