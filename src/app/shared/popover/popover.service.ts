import { ConnectionPositionPair, Overlay, OverlayConfig, PositionStrategy } from '@angular/cdk/overlay';
import { Injectable, InjectionToken, Injector, ViewContainerRef } from '@angular/core';
import { PopoverContent, PopoverRef } from './popover-ref';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { PopoverComponent } from './popover.component';

export const POPOVER_DATA = new InjectionToken<any>('PopoverData');

export class PopoverConfig<T = any> {
  origin: HTMLElement;
  viewContainerRef?: ViewContainerRef;
  width?: string | number;
  height?: string | number;

  data?: T;
}

@Injectable({
  providedIn: 'root'
})
export class Popover {

  constructor(
    private overlay: Overlay,
    private injector: Injector
  ) {
  }

  private static getPositions(): ConnectionPositionPair[] {
    return [
      {
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top'
      }

    ];
  }

  open<T = any>(content: PopoverContent, config: PopoverConfig<T>): PopoverRef<T> {
    const overlayRef = this.overlay.create(this.getOverlayConfig(config));
    const popoverRef = new PopoverRef<T>(overlayRef, content, config.data);

    const injector = this.createInjector(config, popoverRef);
    overlayRef.attach(new ComponentPortal(PopoverComponent, null, injector));
    return popoverRef;
  }

  private createInjector<T>(config: PopoverConfig, popoverRef: PopoverRef<T>): Injector {
    const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
    const tokens = new WeakMap<any, any>([
      [PopoverRef, popoverRef],
      [POPOVER_DATA, config.data]
    ]);
    return new PortalInjector(userInjector || this.injector, tokens);
  }

  private getOverlayConfig<T>(config: PopoverConfig<T>): OverlayConfig {
    return new OverlayConfig({
      hasBackdrop: true,
      width: config.width,
      height: config.height,
      backdropClass: 'popover-backdrop',
      positionStrategy: this.getOverlayPosition(config.origin),
      scrollStrategy: this.overlay.scrollStrategies.close()
    });
  }

  private getOverlayPosition(origin: HTMLElement): PositionStrategy {
    return this.overlay.position()
    // .global();
      .flexibleConnectedTo(origin)
      .withPositions(Popover.getPositions())
      // .withFlexibleDimensions(false)
      .withPush(false);
  }
}
