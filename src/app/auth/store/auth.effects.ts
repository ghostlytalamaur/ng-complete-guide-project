import { Actions, Effect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { AuthenticateSuccess } from './auth.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action } from '@ngrx/store';
import { User } from '../user.model';

@Injectable()
export class AuthEffects {


  @Effect()
  authLogin = this.actions$
    .pipe(
      ofType(AuthActions.AuthActions.LOGIN_START),
      switchMap((action: AuthActions.LoginStart) => this.login(action))
    );
  @Effect()
  autoLogin = this.actions$
    .pipe(
      ofType(AuthActions.AuthActions.AUTO_LOGIN),
      map(() => AuthEffects.handleAutoLogin())
    );
  @Effect()
  authSignUp = this.actions$
    .pipe(
      ofType(AuthActions.AuthActions.SIGN_UP_START),
      switchMap((action: AuthActions.SignUpStart) => this.signUp(action))
    );
  @Effect({ dispatch: false })
  authRedirect = this.actions$
    .pipe(
      ofType(AuthActions.AuthActions.AUTHENTICATE_SUCCESS),
      tap((data: AuthenticateSuccess) => {
        console.log('Navigate to /');
        if (data.payload.redirect) {
          this.router.navigate(['/'])
            .catch(console.log);
        }
      })
    );
  @Effect({ dispatch: false })
  authLogout = this.actions$
    .pipe(
      ofType(AuthActions.AuthActions.LOGOUT),
      tap(() => this.onLogout())
    );

  constructor(
    private readonly actions$: Actions,
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {
  }

  private static storeUser(user: User | undefined): void {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }

  private static loadUser(): User | undefined {
    const userDataStr = localStorage.getItem('user');
    const userData: {
      email: string,
      id: string,
      mToken: string,
      mTokenExpirationDate: string
    } = userDataStr ? JSON.parse(userDataStr) : null;

    if (!userData) {
      return undefined;
    }
    const expirationDate = new Date(userData.mTokenExpirationDate);
    if (userData.mToken) {
      return new User(userData.id, userData.email, userData.mToken, expirationDate);
    }
  }

  private static handleAutoLogin(): Action {
    const user = AuthEffects.loadUser();
    if (user) {
      return new AuthActions.AuthenticateSuccess({ user, redirect: false });
    } else {
      return { type: 'DUMMY' };
    }
  }

  private login(action: AuthActions.LoginStart): Observable<Action> {
    return this.handleAuthenticate(this.authService.login(action.payload.email, action.payload.password));
  }

  private signUp(action: AuthActions.SignUpStart): Observable<Action> {
    return this.handleAuthenticate(this.authService.signUp(action.payload.email, action.payload.password));
  }

  private handleAuthenticate(user$: Observable<User>): Observable<Action> {
    return user$
      .pipe(
        tap(user => {
          AuthEffects.storeUser(user);
          this.authService.autoLogout(user.getTokenExpirationDuration());
        }),
        map(user => new AuthActions.AuthenticateSuccess({ user, redirect: true })),
        catchError((err: Error) => of(new AuthActions.AuthenticateFail({ message: err.message })))
      );
  }

  private onLogout(): void {
    this.authService.clearAutoLogoutTimer();
    AuthEffects.storeUser(undefined);
    this.router.navigate(['/auth'])
      .catch(console.log);
  }

}
