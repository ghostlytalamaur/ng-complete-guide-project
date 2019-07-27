import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../models/recipe';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../shared/BaseComponent';
import { Store } from '@ngrx/store';
import * as fromRecipes from '../store/recipe.reducer';
import * as RecipeActions from '../store/recipe.actions';
import * as IngredientsActions from '../../shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent extends BaseComponent implements OnInit {

  @Input()
  recipe: Recipe | undefined;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly store: Store<fromRecipes.State>
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap(params => this.store.select(fromRecipes.selectRecipe(params.id))),
        takeUntil(this.alive$)
      )
      .subscribe(
        recipe => this.recipe = recipe
      );
  }

  onAddToShoppingList(): void {
    if (this.recipe) {
      this.store.dispatch(new IngredientsActions.AddIngredients([...this.recipe.ingredients]));
    }
  }

  onDeleteRecipe(): void {
    if (this.recipe) {
      this.store.dispatch(RecipeActions.deleteRecipe({ recipeId: this.recipe.id }));
      this.router.navigate(['../'], {relativeTo: this.route})
        .catch(console.log);
    }
  }

}
