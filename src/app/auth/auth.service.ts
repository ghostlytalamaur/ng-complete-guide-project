import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from './user.model';
import { Store } from '@ngrx/store';
import * as AuthActions from './store/auth.actions';
import { fromAuth } from './store';
import Timer = NodeJS.Timer;

const API_KEY = 'AIzaSyBrVa7gZgOU1okS3wVLUiC38_LWrrog1IE';
const SIGN_UP_ENDPOINT = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
const SIGN_IN_ENDPOINT = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;

interface SignUpResponseData {
  kind: string;         // string	The request type, always "identitytoolkit#SignupNewUserResponse".
  idToken: string;      // string	A Firebase Auth ID token for the newly created user.
  email: string;       // the email for the newly created user.
  refreshToken: string; // A Firebase Auth refresh token for the newly created user.
  expiresIn: string;    // The number of seconds in which the ID token expires.
  localId: string;     // The uid of the newly created user.
}

interface LoginResponseData extends SignUpResponseData {
  registered: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenExpirationTimer: Timer | undefined;

  constructor(
    private readonly http: HttpClient,
    private readonly store: Store<fromAuth.State>
  ) {
  }

  private static handleError<T>(errResponse: HttpErrorResponse): Observable<T> {
    const errors: { [key: string]: string } = {
      EMAIL_NOT_FOUND: 'There is no user record corresponding to this identifier.',
      INVALID_PASSWORD: 'The password is invalid or the user does not have a password.',
      USER_DISABLED: 'The user account has been disabled by an administrator.',
      EMAIL_EXISTS: 'This email exists already',
      TOO_MANY_ATTEMPTS_TRY_LATER: 'Too many attempts. Try again later.'
    };

    let errorMessage = 'An unknown error occurred!';
    if (AuthService.isFirebaseError(errResponse.error) && errors[errResponse.error.error.message]) {
      errorMessage = errors[errResponse.error.error.message];
    }
    return throwError(new Error(errorMessage));
  }

  private static isFirebaseError(error: any): error is { error: { message: string } } {
    return error && error.error && error.error.message;
  }

  private static createUser(userId: string, email: string, token: string, expiresIn: number): User {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    return new User(userId, email, token, expirationDate);
  }

  signUp(email: string, password: string): Observable<User> {
    return this.http.post<SignUpResponseData>(SIGN_UP_ENDPOINT,
      { email, password, returnSecureToken: true }
    )
      .pipe(
        map(resData => AuthService.createUser(resData.localId, resData.email, resData.idToken, +resData.expiresIn)),
        catchError(errRes => AuthService.handleError<User>(errRes))
      );
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<LoginResponseData>(SIGN_IN_ENDPOINT,
      { email, password, returnSecureToken: true }
    )
      .pipe(
        map(resData => AuthService.createUser(resData.localId, resData.email, resData.idToken, +resData.expiresIn)),
        catchError(errRes => AuthService.handleError<User>(errRes))
      );
  }

  clearAutoLogoutTimer(): void {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = undefined;
    }
  }

  autoLogout(expirationDuration: number): void {
    this.clearAutoLogoutTimer();
    if (expirationDuration > 0) {
      this.tokenExpirationTimer = setTimeout(() => {
        this.clearAutoLogoutTimer();
        this.store.dispatch(AuthActions.logout());
      }, expirationDuration);
    }
  }

}
