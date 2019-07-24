import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { User } from './user.model';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('https://ng-complete-guide-projec-84903.firebaseio.com')) {
      return this.authService.user$
        .pipe(
          take(1),
          switchMap((user: User) => {
            if (user && user.token) {
              const params = req.params.set('auth', user.token);
              const newReq = req.clone({
                params
              });
              return next.handle(newReq);
            } else {
              return throwError(new Error('Not authenticated'));
            }
          })
        );
    } else {
      return next.handle(req);
    }
  }

}
