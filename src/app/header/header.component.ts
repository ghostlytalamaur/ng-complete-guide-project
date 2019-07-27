import { Component, OnInit } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { BaseComponent } from '../shared/BaseComponent';
import { map, takeUntil } from 'rxjs/operators';
import * as fromRoot from '../store/app.reducer';
import { Store } from '@ngrx/store';
import * as AuthActions from '../auth/store/auth.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends BaseComponent implements OnInit {
  navbarCollapsed = true;
  isAuthenticated = false;

  constructor(
    private readonly dataStorageService: DataStorageService,
    private store: Store<fromRoot.AppState>
  ) {
    super();
  }

  ngOnInit(): void {
    // this.onFetchData();
    this.store.select('auth')
      .pipe(
        map(authState => authState.user),
        takeUntil(this.alive$)
      )
      .subscribe(user => {
        this.isAuthenticated = !!user;
      });

  }

  onSaveData(): void {
    this.dataStorageService.storeRecipes();
  }

  onFetchData(): void {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout(): void {
    this.store.dispatch(new AuthActions.Logout());
  }
}
