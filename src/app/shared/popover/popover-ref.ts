import { TemplateRef, Type } from '@angular/core';
import { Subject } from 'rxjs';
import { OverlayRef } from '@angular/cdk/overlay';


export type PopoverCloseEventType = 'backdropClick' | 'close';

export class PopoverCloseEvent<T = any> {
  type: PopoverCloseEventType;
  data: T | undefined;
}

export type PopoverContent = TemplateRef<any> | Type<any> | string;

export class PopoverRef<T = any> {
  private afterClosed = new Subject<PopoverCloseEvent<T>>();
  readonly afterClosed$ = this.afterClosed.asObservable();

  constructor(public overlay: OverlayRef,
              public content: PopoverContent,
              public data: T | undefined) {
    overlay.backdropClick().subscribe(() => {
      this.closeInternal('backdropClick', undefined);
    });
  }

  close(data?: T): void {
    this.closeInternal('close', data);
  }

  private closeInternal(type: PopoverCloseEventType, data: T | undefined): void {
    this.overlay.dispose();
    this.afterClosed.next({
      type,
      data
    });

    this.afterClosed.complete();
  }
}

