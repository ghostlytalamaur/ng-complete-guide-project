import { Injectable } from '@angular/core';
import { Recipe } from '../models/recipe';
import { Ingredient } from '../../shared/models/ingredient';
import { IngredientsService } from '../../shopping-list/services/ingredients.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';
import * as fromRoot from '../../store/app.reducer';

@Injectable({
  providedIn: 'root' // RecipesServiceModule
})
export class RecipesService {

  private readonly recipes: BehaviorSubject<Recipe[]> = new BehaviorSubject<Recipe[]>([]);

  constructor(
    private ingredientsService: IngredientsService,
    private store: Store<fromRoot.AppState>
  ) {
    console.log('constructing RecipesService');
  }

  getRecipes(): Observable<Recipe[]> {
    return this.recipes.pipe(
      map(items => items.slice()),
    );
  }

  getRecipe(id: string): Observable<Recipe | undefined> {
    return this.recipes.pipe(
      map(items => items.find(r => r.id === id))
    );
  }

  addRecipe(recipe: Recipe): void {
    if (!recipe) {
      return;
    }

    this.recipes.value.push(recipe);
    this.recipes.next(this.recipes.value);
  }

  updateRecipe(recipe: Recipe): void {
    const idx = this.recipes.value.findIndex(r => r.id === recipe.id);
    if (idx >= 0) {
      this.recipes.value[idx] = recipe;
      this.recipes.next(this.recipes.value);
    }
  }

  addIngredientsToShoppingList(...ingredients: Ingredient[]): void {
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
    // this.ingredientsService.addIngredients(...ingredients);
  }

  deleteRecipe(recipe: Recipe): void {
    const idx = this.recipes.value.findIndex(r => r.id === recipe.id);
    if (idx >= 0) {
      this.recipes.value.splice(idx, 1);
      this.recipes.next(this.recipes.value);
    }
  }

  setRecipes(...recipes: Recipe[]): void {
    this.recipes.next(recipes);
  }

  hasRecipes(): boolean {
    return this.recipes.value.length > 0;
  }
}

