import { User } from '../user.model';
import * as AuthActions from './auth.actions';
import { fromRoot } from '../../store';
import { Action, createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';

export const authFeatureKey = 'auth';

export interface AuthState {
  user: User | undefined;
  authError: string | undefined;
  loading: boolean;
}

export interface State extends fromRoot.AppState {
  [authFeatureKey]: AuthState;
}

const initialState: AuthState = {
  user: undefined,
  authError: undefined,
  loading: false
};

const authReducer = createReducer(initialState,
  on(AuthActions.loginStart, (state) => {
    return {
      ...state,
      authError: undefined,
      loading: true
    };
  }),

  on(AuthActions.signUpStart, (state) => {
    return {
      ...state,
      authError: undefined,
      loading: true
    };
  }),

  on(AuthActions.authenticateSuccess, (state, { user }) => {
    return {
      ...state,
      user,
      authError: undefined,
      loading: false
    };
  }),

  on(AuthActions.authenticateFail, (state, { message }) => {
    return {
      ...state,
      user: undefined,
      authError: message,
      loading: false
    };
  }),

  on(AuthActions.logout, (state) => {
    return {
      ...state,
      user: undefined
    };
  }),

  on(AuthActions.clearError, (state) => {
    return {
      ...state,
      authError: undefined
    };
  })
);

export function reducer(state: AuthState | undefined, action: Action): AuthState {
  return authReducer(state, action);
}

export const selectAuthState = createFeatureSelector<AuthState>(authFeatureKey);
export const getIsLoading = createSelector(
  selectAuthState,
  state => state.loading
);

export const getUser = createSelector(
  selectAuthState,
  state => state ? state.user : undefined
);
