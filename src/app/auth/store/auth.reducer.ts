import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface State {
  user: User | undefined;
  authError: string | undefined;
  loading: boolean;
}

const initialState: State = {
  user: undefined,
  authError: undefined,
  loading: false
};

export function authReducer(state: State = initialState, action: AuthActions.Actions): State {
  switch (action.type) {
    case AuthActions.AuthActions.LOGIN_START:
      return {
        ...state,
        authError: undefined,
        loading: true
      };

    case AuthActions.AuthActions.SIGN_UP_START:
      return {
        ...state,
        authError: undefined,
        loading: true
      };

    case AuthActions.AuthActions.AUTHENTICATE_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        authError: undefined,
        loading: false
      };

    case AuthActions.AuthActions.AUTHENTICATE_FAIL:
      return {
        ...state,
        user: undefined,
        authError: action.payload.message,
        loading: false
      };

    case AuthActions.AuthActions.LOGOUT:
      console.log('Handle Logout action');
      return {
        ...state,
        user: undefined
      };

    case AuthActions.AuthActions.CLEAR_ERROR:
      return {
        ...state,
        authError: undefined
      };

    default:
      return state;

  }
}
