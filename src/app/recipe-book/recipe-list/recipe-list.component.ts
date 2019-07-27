import { Component, OnInit } from '@angular/core';
import { Recipe } from '../models/recipe';
import { Observable } from 'rxjs';
import { BaseComponent } from '../../shared/BaseComponent';
import { Store } from '@ngrx/store';
import * as fromRecipes from '../store/recipe.reducer';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent extends BaseComponent implements OnInit {

  recipes$: Observable<Recipe[]>;

  constructor(
    private readonly store: Store<fromRecipes.State>
  ) {
    super();
  }

  ngOnInit(): void {
    this.recipes$ = this.store.select(fromRecipes.selectRecipes);
    // this.recipes$ = this.recipesService.getRecipes();
  }
}
