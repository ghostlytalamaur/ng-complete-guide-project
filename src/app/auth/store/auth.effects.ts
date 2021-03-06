import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action, Store } from '@ngrx/store';
import { createUser, User } from '../user.model';
import { fromAuth } from './index';

@Injectable()
export class AuthEffects implements OnInitEffects {

  authLogin = createEffect(() =>
    this.actions$
      .pipe(
        ofType(AuthActions.loginStart),
        switchMap(action => this.login(action.email, action.password))
      )
  );

  autoLogin = createEffect(() =>
    this.actions$
      .pipe(
        ofType(AuthActions.autoLogin),
        map(() => this.handleAutoLogin())
      )
  );

  authSignUp = createEffect(() =>
    this.actions$
      .pipe(
        ofType(AuthActions.signUpStart),
        switchMap(action => this.signUp(action.email, action.email))
      )
  );

  authRedirect = createEffect(() =>
      this.actions$
        .pipe(
          ofType(AuthActions.authenticateSuccess),
          tap(data => {
            if (data.redirect) {
              this.router.navigate(['/'])
                .catch(console.log);
            }
          })
        ),
    { dispatch: false }
  );

  authLogout = createEffect(() =>
      this.actions$
        .pipe(
          ofType(AuthActions.logout),
          tap(() => this.onLogout())
        ),
    { dispatch: false }
  );
  private tokenExpirationTimer: any;

  constructor(
    private readonly actions$: Actions,
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly store: Store<fromAuth.State>
  ) {
    console.log('constructing AuthEffects');
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
    const userData: User = userDataStr ? JSON.parse(userDataStr) : null;

    if (!userData) {
      return undefined;
    }
    if (userData.token) {
      return createUser(userData.id, userData.email, userData.token, userData.tokenExpirationDate);
    }
  }

  clearAutoLogoutTimer(): void {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = undefined;
    }
  }

  autoLogout(user: User): void {
    const expirationDuration = new Date(user.tokenExpirationDate).getTime() - new Date().getTime();
    this.clearAutoLogoutTimer();
    if (expirationDuration > 0) {
      this.tokenExpirationTimer = setTimeout(() => {
        this.clearAutoLogoutTimer();
        this.store.dispatch(AuthActions.logout());
      }, expirationDuration);
    }
  }

  ngrxOnInitEffects(): Action {
    console.log('dispatch autoLogin');
    return AuthActions.autoLogin();
  }

  private login(email: string, password: string): Observable<Action> {
    return this.handleAuthenticate(this.authService.login(email, password));
  }

  private signUp(email: string, password: string): Observable<Action> {
    return this.handleAuthenticate(this.authService.signUp(email, password));
  }

  private handleAutoLogin(): Action {
    const user = AuthEffects.loadUser();
    if (user) {
      this.autoLogout(user);
      return AuthActions.authenticateSuccess({ user, redirect: false });
    } else {
      return { type: 'DUMMY' };
    }
  }

  private handleAuthenticate(user$: Observable<User>): Observable<Action> {
    return user$
      .pipe(
        tap(user => {
          AuthEffects.storeUser(user);
          this.autoLogout(user);
        }),
        map(user => AuthActions.authenticateSuccess({ user, redirect: true })),
        catchError((err: Error) => of(AuthActions.authenticateFail({ message: err.message })))
      );
  }

  private onLogout(): void {
    this.clearAutoLogoutTimer();
    AuthEffects.storeUser(undefined);
    this.router.navigate(['/auth'])
      .catch(console.log);
  }

}
