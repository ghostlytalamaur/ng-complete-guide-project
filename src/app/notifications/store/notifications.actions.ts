import { createAction, props } from '@ngrx/store';

export const addNotification = createAction(
  '[Notifications] Add Notification',
  props<{ message: string }>()
);

export const removeNotification = createAction(
  '[Notifications] Remove Notification',
  props<{ id: string }>()
);
