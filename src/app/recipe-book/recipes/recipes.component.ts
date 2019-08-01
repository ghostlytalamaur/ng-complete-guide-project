import { Component, OnInit } from '@angular/core';
import { RecipesService } from '../services/recipes.service';
import { BaseComponent } from '../../shared/BaseComponent';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent extends BaseComponent implements OnInit {

  isLoaded: boolean;
  error: string | undefined;

  constructor(
    private readonly service: RecipesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.service.getIsLoaded()
      .pipe(takeUntil(this.alive$))
      .subscribe(isLoaded => this.isLoaded = isLoaded);
    this.service.getError()
      .pipe(takeUntil(this.alive$))
      .subscribe(error => this.error = error);
  }

  onRefresh(): void {
    this.service.loadRecipes();
  }
}
