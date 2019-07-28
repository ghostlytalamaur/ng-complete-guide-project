import { NgModule } from '@angular/core';
import { PopoverComponent } from './popover.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { DropdownDirective } from './dropdown.directive';

@NgModule({
  imports: [
    OverlayModule
  ],
  declarations: [
    DropdownDirective
  ],
  exports: [
    DropdownDirective
  ],
  entryComponents: [
    PopoverComponent
  ]
})
export class PopoverModule {
}
