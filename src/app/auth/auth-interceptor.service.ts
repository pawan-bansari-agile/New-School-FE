import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, Observable, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        return this.authService.school.pipe(
          take(1),
          exhaustMap((school) => {
            if (!user && !school) {
              return next.handle(req);
            }

            const modifiedReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${
                  user ? user.access_token : school.access_token
                }`,
              },
            });
            return next.handle(modifiedReq);
          })
        );
      })
    );
  }
}
