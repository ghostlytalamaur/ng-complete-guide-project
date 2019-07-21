import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

export class BaseComponent implements OnDestroy {
  private readonly aliveSubject$ = new Subject<void>();
  protected alive$ = this.aliveSubject$.asObservable();

  ngOnDestroy(): void {
    console.log(BaseComponent.name, '.ngOnDestroy()');
    this.aliveSubject$.next();
    this.aliveSubject$.complete();
  }
}
