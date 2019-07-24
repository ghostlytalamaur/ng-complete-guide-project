import { Component, OnInit } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { BaseComponent } from '../shared/BaseComponent';
import { takeUntil } from 'rxjs/operators';

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
    private readonly authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    // this.onFetchData();
    this.authService.user$
      .pipe(
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
    this.authService.logout();
  }
}
