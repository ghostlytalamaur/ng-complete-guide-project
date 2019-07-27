import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Store } from '@ngrx/store';
import * as fromRoot from './store/app.reducer';
import * as AuthAction from './auth/store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private readonly authService: AuthService,
    private readonly store: Store<fromRoot.AppState>
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new AuthAction.AutoLogin());
  }
}
