import { Component, OnInit } from '@angular/core';
import { RecipesDataStorageService } from '../recipe-book/services/recipes-data-storage.service';
import { BaseComponent } from '../shared/BaseComponent';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as AuthActions from '../auth/store/auth.actions';
import { fromAuth } from '../auth/store';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends BaseComponent implements OnInit {
  navbarCollapsed = true;
  isAuthenticated = false;

  constructor(
    private readonly dataStorageService: RecipesDataStorageService,
    private store: Store<fromAuth.State>
  ) {
    super();
  }

  ngOnInit(): void {
    this.store.select(fromAuth.getUser)
      .pipe(
        takeUntil(this.alive$)
      )
      .subscribe(user => {
        this.isAuthenticated = !!user;
      });

  }

  onLogout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
