import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { User } from './user.model';
import { Store } from '@ngrx/store';
import * as fromRoot from '../store/app.reducer';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private store: Store<fromRoot.AppState>) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('https://ng-complete-guide-projec-84903.firebaseio.com')) {
      return this.store.select('auth')
        .pipe(
          take(1),
          map(authState => authState.user),
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
