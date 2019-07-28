import { NgModule } from '@angular/core';
import { NotificationsPanelComponent } from './notifications-panel/notifications-panel.component';
import { PopoverModule } from '../shared/popover/popover.module';
import { CommonModule } from '@angular/common';
import { MatBadgeModule, MatButtonModule, MatListModule } from '@angular/material';
import { StoreModule } from '@ngrx/store';
import * as fromNotifications from './store/notifications.reducer';
import { NotificationsButtonComponent } from './notifications-button/notifications-button.component';

@NgModule({
  declarations: [
    NotificationsPanelComponent,
    NotificationsButtonComponent
  ],
  entryComponents: [
    NotificationsPanelComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatListModule,
    MatBadgeModule,
    PopoverModule,
    StoreModule.forFeature(fromNotifications.notificationsFeatureKey, fromNotifications.reducer)
  ],
  exports: [
    NotificationsPanelComponent,
    NotificationsButtonComponent
  ]
})
export class NotificationsModule {
}
