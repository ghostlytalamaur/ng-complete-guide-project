import { Component, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  template: `
      <div class="dropdown dropleft">
          <div class="dropdown-menu show">
              <ng-container *ngTemplateOutlet="menuTemplate"></ng-container>
          </div>
      </div>
  `
})
export class DropdownComponent implements OnInit {
  @Input()
  menuTemplate: TemplateRef<any>;

  ngOnInit(): void {
  }
}
