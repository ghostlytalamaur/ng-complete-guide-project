import { Component, OnInit, TemplateRef } from '@angular/core';
import { PopoverContent, PopoverRef } from './popover-ref';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss']
})
export class PopoverComponent implements OnInit {

  content: PopoverContent;
  renderMethod: 'text' | 'template' | 'component' = 'component';
  context: unknown;

  constructor(
    private popoverRef: PopoverRef
  ) {
  }

  ngOnInit(): void {
    this.content = this.popoverRef.content;
    if (typeof this.content === 'string') {
      this.renderMethod = 'text';
    } else if (this.content instanceof TemplateRef) {
      this.renderMethod = 'template';
      this.context = {
        close: this.popoverRef.close.bind(this.popoverRef)
      };
    }
    console.log('Popover render method: ', this.renderMethod);
    console.log('Popover content: ', this.content);
  }

}
