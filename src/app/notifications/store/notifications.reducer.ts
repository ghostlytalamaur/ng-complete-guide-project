import * as fromRoot from '../../store/app.reducer';
import { NotifyItem } from '../models/notify-item';
import { Action, createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as NotificationsActions from './notifications.actions';

export const notificationsFeatureKey = 'notifications';

export interface NotificationsState {
  messages: NotifyItem[];
}

export interface State extends fromRoot.AppState {
  [notificationsFeatureKey]: NotificationsState;
}

const initialState: NotificationsState = {
  messages: [
    new NotifyItem('Test notification 1 with long long long description'),
    new NotifyItem('Test notification 2 with very very long description'),
    new NotifyItem('Test notification 1 with long long long description'),
    new NotifyItem('Test notification 2 with very very long description'),
    new NotifyItem('Test notification 1 with long long long description'),
    new NotifyItem('Test notification 2 with very very long description'),
    new NotifyItem('Test notification 1 with long long long description'),
    new NotifyItem('Test notification 2 with very very long description'),
    new NotifyItem('Test notification 1 with long long long description'),
    new NotifyItem('Test notification 2 with very very long description'),
    new NotifyItem('Test notification 1 with long long long description'),
    new NotifyItem('Test notification 2 with very very long description'),
    new NotifyItem('Test notification 1 with long long long description'),
    new NotifyItem('Test notification 2 with very very long description'),
    new NotifyItem('Test notification 1 with long long long description'),
    new NotifyItem('Test notification 2 with very very long description'),
    new NotifyItem('Test notification 1 with long long long description'),
    new NotifyItem('Test notification 2 with very very long description')
  ]
};

const notificationsReducer = createReducer(initialState,
  on(NotificationsActions.addNotification, (state, { message }) => {
    return {
      ...state,
      messages: state.messages.concat(new NotifyItem(message))
    };
  }),

  on(NotificationsActions.removeNotification, (state, { id }) => {
    return {
      ...state,
      messages: state.messages.filter(n => n.id !== id)
    };
  })
);

export function reducer(state: NotificationsState | undefined, action: Action): NotificationsState {
  return notificationsReducer(state, action);
}

export const selectNotificationsState = createFeatureSelector<State, NotificationsState>(notificationsFeatureKey);
export const selectNotifications = createSelector(
  selectNotificationsState,
  state => state.messages
);

export const selectNotificationsCount = createSelector(
  selectNotifications,
  state => state.length
);
