import { Injectable, inject } from '@angular/core';
import { HttpEvent, 
         HttpInterceptor, 
         HttpHandler, 
         HttpRequest,
         HTTP_INTERCEPTORS,
         HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, map, lastValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ROUTE_DASHBOARD, MY_JOURNEY_AUTH_CONSTANT } from '@constants/index';
import { AgendaService } from '@api/index';
import { LocalstorageService } from '@services/index';

export class httpInterceptorService implements HttpInterceptor {
  private router = inject(Router);
  private agendaService = inject(AgendaService);
  private localStorageService = inject(LocalstorageService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   return next.handle(req).pipe(
    catchError((error: HttpErrorResponse) => {
     if (error.status === 412) {
      this.agendaService.refreshAccessTokens()
      .pipe(map((result) => {
        this.localStorageService.setItem(MY_JOURNEY_AUTH_CONSTANT, result);
        return result;
      }));
     }
     if (error.status === 417) {
      this.localStorageService.removeItem(MY_JOURNEY_AUTH_CONSTANT);
      this.router.navigate([ROUTE_DASHBOARD]);
     }
     return throwError(() => error);
    }),
   );
  }
 }
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: httpInterceptorService, multi: true },
];
