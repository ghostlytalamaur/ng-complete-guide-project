import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromNotifications from '../store/notifications.reducer';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notifications-button',
  templateUrl: './notifications-button.component.html',
  styleUrls: ['./notifications-button.component.scss']
})
export class NotificationsButtonComponent implements OnInit {
  notificationsCount$: Observable<number>;

  constructor(
    private readonly store: Store<fromNotifications.State>
  ) {
    this.notificationsCount$ = this.store.select(fromNotifications.selectNotificationsCount);
  }

  ngOnInit(): void {
  }

}
