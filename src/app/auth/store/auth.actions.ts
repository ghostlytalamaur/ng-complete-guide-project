import { createAction, props } from '@ngrx/store';
import { User } from '../user.model';

export const authenticateSuccess = createAction(
  '[Auth] Login',
  props<{ user: User, redirect: boolean }>()
);

export const logout = createAction(
  '[Auth] Logout'
);

export const loginStart = createAction(
  '[Auth] Login Start',
  props<{ email: string, password: string }>()
);

export const authenticateFail = createAction(
  '[Auth] Login Failed',
  props<{ message: string }>()
);

export const signUpStart = createAction(
  '[Auth] Sign Up Start',
  props<{ email: string, password: string }>()
);

export const clearError = createAction(
  '[Auth] Clear Error'
);

export const autoLogin = createAction(
  '[Auth] Auto Login'
);
