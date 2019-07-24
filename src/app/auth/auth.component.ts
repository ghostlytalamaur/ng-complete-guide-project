import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, LoginResponseData, SignUpResponseData } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {

  isLoginMode = true;
  isLoading = false;
  error = 'test error';
  @ViewChild(PlaceholderDirective, {static: false})
  alertHost: PlaceholderDirective;
  private closeSub: Subscription;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly componentFactoryResolver: ComponentFactoryResolver
  ) {
  }

  ngOnInit(): void {
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

    const email = form.value.email;
    const password = form.value.password;
    let auth$: Observable<SignUpResponseData | LoginResponseData>;
    if (this.isLoginMode) {
      auth$ = this.authService.login(email, password);
    } else {
      auth$ = this.authService.signUp(email, password);
    }
    this.isLoading = true;
    auth$
      .subscribe(
        data => {
          this.isLoading = false;
          this.router.navigate(['/recipes'])
            .catch(console.log);
        },
        (err: Error) => {
          this.error = err.message;
          this.showErrorAlert(err.message);
          this.isLoading = false;
        }
      );
    form.reset();
  }

  onHandleError(): void {
    // this.error = '';
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
      hostViewContainerRef.clear();
    });
  }
}
