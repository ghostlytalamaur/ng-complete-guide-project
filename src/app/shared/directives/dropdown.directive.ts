import { ComponentFactoryResolver, Directive, ElementRef, HostListener, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { DropdownComponent } from './dropdown.component';

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

  constructor(
    private readonly parentRef: ElementRef<HTMLElement>,
    private readonly vcRef: ViewContainerRef,
    private readonly componentsFactoryResolver: ComponentFactoryResolver
  ) {
  }

  @HostListener('document:click', ['$event'])
  onHostClick(event: MouseEvent): void {
    this.isOpen = this.parentRef.nativeElement.contains(event.target as Node) ? !this.isOpen : false;
    if (this.isOpen) {
      const factory = this.componentsFactoryResolver.resolveComponentFactory(DropdownComponent);
      const dropdown = this.vcRef.createComponent(factory);
      dropdown.instance.menuTemplate = this.templateRef;
      dropdown.changeDetectorRef.detectChanges();
    } else {
      this.vcRef.clear();
    }
  }
}
