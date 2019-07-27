import { Action } from '@ngrx/store';
import { User } from '../user.model';

export enum AuthActions {
  LOGIN_START = '[Auth] Login start',
  AUTHENTICATE_SUCCESS = '[Auth] Login',
  AUTHENTICATE_FAIL = '[Auth] Login failed',
  SIGN_UP_START = '[Auth] SignUp start',
  LOGOUT = '[Auth] Logout',
  CLEAR_ERROR = '[Auth] Clear error',
  AUTO_LOGIN = '[Auth] Auto login'
}

export class AuthenticateSuccess implements Action {
  readonly type = AuthActions.AUTHENTICATE_SUCCESS;

  constructor(public readonly payload: { user: User }) {
  }
}

export class Logout implements Action {
  readonly type = AuthActions.LOGOUT;
}

export class LoginStart implements Action {
  readonly type = AuthActions.LOGIN_START;

  constructor(public readonly payload: { email: string, password: string }) {
  }
}

export class AuthenticateFail implements Action {
  readonly type = AuthActions.AUTHENTICATE_FAIL;

  constructor(public payload: { message: string }) {
  }
}

export class SignUpStart implements Action {
  readonly type = AuthActions.SIGN_UP_START;

  constructor(public readonly payload: { email: string, password: string }) {
  }
}

export class ClearError implements Action {
  readonly type = AuthActions.CLEAR_ERROR;
}

export class AutoLogin implements Action {
  readonly type = AuthActions.AUTO_LOGIN;
}

export type Actions =
  AuthenticateSuccess |
  Logout |
  LoginStart |
  SignUpStart |
  AuthenticateFail |
  ClearError |
  AutoLogin;
