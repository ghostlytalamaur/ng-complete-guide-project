import { Directive, ElementRef, HostListener, Input, TemplateRef } from '@angular/core';
import { Popover } from './popover.service';
import { PopoverRef } from './popover-ref';

@Directive({
  selector: '[appDropdown]',
  host: {
    class: 'dropdown-toggle'
  }
})
export class DropdownDirective {

  isOpen = false;

  @Input('appDropdown')
  templateRef: TemplateRef<any>;
  private popoverRef: PopoverRef | undefined;

  constructor(
    private readonly parentRef: ElementRef<HTMLElement>,
    private readonly popover: Popover
  ) {
  }

  @HostListener('click', ['$event'])
  onHostClick(ignored: MouseEvent): void {
    if (this.popoverRef) {
      this.popoverRef.close();
      this.popoverRef = undefined;
    }
    this.popoverRef = this.popover.open<never>(this.templateRef, {
      origin: this.parentRef.nativeElement
    });
    this.popoverRef.afterClosed$
      .subscribe(() => this.popoverRef = undefined);
  }
}
