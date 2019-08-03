import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { User } from './user.model';
import { Store } from '@ngrx/store';
import * as fromRoot from '../store/app.reducer';
import { fromAuth } from './store';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private store: Store<fromRoot.AppState>) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes(environment.firebase.endpoint)) {
      return this.store.select(fromAuth.getUser)
        .pipe(
          take(1),
          switchMap((user: User) => {
            if (user && user.token) {
              const newUrl = environment.firebase.endpoint + `/users/${user.id}` + req.url.substr(environment.firebase.endpoint.length);
              const params = req.params.set('auth', user.token);
              const newReq = req.clone({
                url: newUrl,
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
