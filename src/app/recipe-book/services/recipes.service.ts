import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PartialRecipe, Recipe } from '../models/recipe';
import { Store } from '@ngrx/store';
import * as fromRecipes from '../store/recipe.reducer';
import { getIsLoaded } from '../store/recipe.reducer';
import * as RecipeActions from '../store/recipe.actions';
import { Ingredient } from '../../shared/models/ingredient';
import { take } from 'rxjs/operators';
import { IngredientsService } from '../../shopping-list/services/ingredients.service';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  constructor(
    private readonly store: Store<fromRecipes.State>,
    private readonly ingredientsService: IngredientsService
  ) {
  }

  getRecipes(): Observable<Recipe[]> {
    return this.store.select(fromRecipes.getRecipes);
  }

  getRecipe(id: string): Observable<Recipe | undefined> {
    return this.store.select(fromRecipes.getRecipe(id));
  }

  addRecipe(recipe: Recipe): void {
    this.store.dispatch(RecipeActions.addRecipe({ recipe }));
  }

  updateRecipe(recipe: PartialRecipe): void {
    this.store.dispatch(RecipeActions.updateRecipe({ recipe }));
  }

  deleteRecipe(id: string): void {
    this.store.dispatch(RecipeActions.deleteRecipe({ recipeId: id }));
  }

  addIngredientsToShoppingList(...ingredients: Ingredient[]): void {
    this.ingredientsService.addIngredients(...ingredients);
  }

  getIsLoaded(): Observable<boolean> {
    return this.store.select(fromRecipes.getIsLoaded);
  }

  getError(): Observable<string | undefined> {
    return this.store.select(fromRecipes.getFetchError);
  }

  loadRecipes(): void {
    this.store.select(getIsLoaded)
      .pipe(
        take(1)
      )
      .subscribe(
        isLoaded => {
          if (!isLoaded) {
            this.store.dispatch(RecipeActions.fetchRecipes());
          }
        }
      );
  }

}
