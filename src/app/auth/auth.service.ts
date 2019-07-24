import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';
import { Router } from '@angular/router';
import Timer = NodeJS.Timer;

const API_KEY = 'AIzaSyBrVa7gZgOU1okS3wVLUiC38_LWrrog1IE';
const SIGN_UP_ENDPOINT = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
const SIGN_IN_ENDPOINT = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;

export interface SignUpResponseData {
  kind: string;         // string	The request type, always "identitytoolkit#SignupNewUserResponse".
  idToken: string;      // string	A Firebase Auth ID token for the newly created user.
  email: string;       // the email for the newly created user.
  refreshToken: string; // A Firebase Auth refresh token for the newly created user.
  expiresIn: string;    // The number of seconds in which the ID token expires.
  localId: string;     // The uid of the newly created user.
}

export interface LoginResponseData extends SignUpResponseData {
  registered: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly user: BehaviorSubject<User | null>;
  readonly user$: Observable<User | null>;
  private tokenExpirationTimer: Timer;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {
    this.user = new BehaviorSubject<User | null>(null);
    this.user$ = this.user.asObservable();
  }

  private static handleError<T>(errResponse: HttpErrorResponse): Observable<T> {
    const errors: {[key: string]: string} = {
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
    // throw new Error(errorMessage);
    return throwError(new Error(errorMessage));
  }

  private static isFirebaseError(error: any): error is {error: {message: string}} {
    return error && error.error && error.error.message;
  }

  signUp(email: string, password: string): Observable<SignUpResponseData> {
    return this.http.post<SignUpResponseData>(SIGN_UP_ENDPOINT,
      { email, password, returnSecureToken: true }
    )
      .pipe(
        catchError(errRes => AuthService.handleError<SignUpResponseData>(errRes)),
        tap(resData => this.handleAuthentication(resData.localId, resData.email, resData.idToken, +resData.expiresIn))
      );
  }

  login(email: string, password: string): Observable<LoginResponseData> {
    return this.http.post<LoginResponseData>(SIGN_IN_ENDPOINT,
      { email, password, returnSecureToken: true}
    )
      .pipe(
        catchError(errRes => AuthService.handleError<LoginResponseData>(errRes)),
        tap(resData => this.handleAuthentication(resData.localId, resData.email, resData.idToken, +resData.expiresIn))
      );
  }

  autoLogin(): void {
    const userDataStr = localStorage.getItem('userData');
    const userData: {
      email: string,
      id: string,
      mToken: string,
      mTokenExpirationDate: string
    } = userDataStr ? JSON.parse(userDataStr) : null;

    if (!userData) {
      return;
    }
    const expirationDate = new Date(userData.mTokenExpirationDate);
    const storedUser = new User(userData.id, userData.email, userData.mToken, expirationDate);
    if (storedUser.token) {
      this.user.next(storedUser);
      const expirationDuration = expirationDate.getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout(): void {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.user.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['/auth']).catch(console.log);
  }

  private autoLogout(expirationDuration: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(userId: string, email: string, token: string, expiresIn: number): void {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(userId, email, token, expirationDate);
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
    this.autoLogout(expiresIn * 1000);
  }
}
