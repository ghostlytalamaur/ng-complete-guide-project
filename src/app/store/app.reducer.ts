import { Action, ActionReducerMap } from '@ngrx/store';
import * as AuthActions from '../auth/store/auth.actions';
import { State } from '../auth/store/auth.reducer';


// tslint:disable-next-line:no-empty-interface
export interface AppState {
}

export const appReducer: ActionReducerMap<AppState> = {
};

export function clearStateOnLogout(red: (state: State | undefined, action: Action) => State):
  (state: State | undefined, action: Action) => State | undefined {

  return (state, action) => {
    console.log(state);
    if (action.type === AuthActions.logout.type) {
      state = undefined;
    }
    return red(state, action);
  };
}

