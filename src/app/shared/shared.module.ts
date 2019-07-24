import { NgModule } from '@angular/core';
import { AlertComponent } from './alert/alert.component';
import { PlaceholderDirective } from './placeholder/placeholder.directive';
import { DropdownDirective } from './directives/dropdown.directive';
import { DropdownComponent } from './directives/dropdown.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material';

@NgModule({
  declarations: [
    DropdownDirective,
    DropdownComponent,
    AlertComponent,
    PlaceholderDirective
  ],
  entryComponents: [
    DropdownComponent,
    AlertComponent
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
