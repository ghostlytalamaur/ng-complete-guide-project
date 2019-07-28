import { NgModule } from '@angular/core';
import { AlertComponent } from './alert/alert.component';
import { PlaceholderDirective } from './placeholder/placeholder.directive';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material';
import { PopoverComponent } from './popover/popover.component';

@NgModule({
  declarations: [
    AlertComponent,
    PlaceholderDirective,
    PopoverComponent
  ],
  entryComponents: [
    AlertComponent,
    PopoverComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule
  ],
  exports: [
    AlertComponent,
    PlaceholderDirective
  ]
})
export class SharedModule {}
