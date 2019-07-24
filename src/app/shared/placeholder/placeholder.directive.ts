import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appPlaceHolder]'
})
export class PlaceholderDirective {
  constructor(
    public readonly viewContainerRef: ViewContainerRef
  ) {}
}
