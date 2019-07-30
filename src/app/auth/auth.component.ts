import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { Store } from '@ngrx/store';
import * as AuthActions from './store/auth.actions';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../shared/BaseComponent';
import { fromAuth } from './store';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent extends BaseComponent implements OnInit, OnDestroy {

  isLoginMode = true;
  isLoading = false;
  @ViewChild(PlaceholderDirective, {static: false})
  alertHost: PlaceholderDirective;
  private closeSub: Subscription;

  constructor(
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly store: Store<fromAuth.State>
  ) {
    super();
  }

  ngOnInit(): void {
    this.store.select(fromAuth.selectAuthState)
      .pipe(
        takeUntil(this.alive$)
      )
      .subscribe(
        authState => {
          this.isLoading = authState.loading;
          if (authState.authError) {
            this.showErrorAlert(authState.authError);
          }
        }
      );
  }

  ngOnDestroy(): void {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
  }

  onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) {
      return;
    }

    const credentials = { email: form.value.email, password: form.value.password };
    if (this.isLoginMode) {
      this.store.dispatch(AuthActions.loginStart(credentials));
    } else {
      this.store.dispatch(AuthActions.signUpStart(credentials));
    }

    form.reset();
  }

  private clearError(): void {
    this.store.dispatch(AuthActions.clearError());
    this.alertHost.viewContainerRef.clear();
  }

  private showErrorAlert(message: string): void {
    const factory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(factory);
    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      this.clearError();
    });
  }
}
