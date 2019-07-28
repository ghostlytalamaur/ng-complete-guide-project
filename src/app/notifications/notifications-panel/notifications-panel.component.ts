import { Component, OnInit } from '@angular/core';
import * as fromNotifications from '../store/notifications.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NotifyItem } from '../models/notify-item';
import * as NotificationsActions from '../store/notifications.actions';

@Component({
  selector: 'app-notifications-panel',
  templateUrl: './notifications-panel.component.html',
  styleUrls: ['./notifications-panel.component.scss'],
  host: {}
})
export class NotificationsPanelComponent implements OnInit {

  notifications$: Observable<NotifyItem[]>;

  constructor(
    private readonly store: Store<fromNotifications.State>
  ) {
    this.notifications$ = this.store.select(fromNotifications.selectNotifications);
  }

  ngOnInit(): void {
  }

  onRemoveNotification(id: string): void {
    this.store.dispatch(NotificationsActions.removeNotification({ id }));
  }
}
