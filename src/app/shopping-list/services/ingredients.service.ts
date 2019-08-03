import { Injectable } from '@angular/core';
import { Ingredient, PartialIngredient } from '../../shared/models/ingredient';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { fromShoppingList, ShoppingListActions } from '../store';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IngredientsService {

  constructor(
    private readonly store: Store<fromShoppingList.State>
  ) {
    console.log('constructing IngredientsService');
  }

  loadIngredients(): void {
    this.store.select(fromShoppingList.getIsLoaded)
      .pipe(
        take(1)
      )
      .subscribe(
        isLoaded => {
          if (!isLoaded) {
            this.store.dispatch(ShoppingListActions.fetchIngredients());
          }
        }
      );
  }

  getIngredients(): Observable<Ingredient[]> {
    return this.store.select(fromShoppingList.getIngredients);
  }

  getIngredient(name: string): Observable<Ingredient | undefined> {
    return this.store.select(fromShoppingList.getIngredient(name));
  }

  addIngredient(ingredient: Ingredient): void {
    this.store.dispatch(ShoppingListActions.addIngredient({ ingredient }));
  }

  deleteIngredient(id: string): void {
    this.store.dispatch(ShoppingListActions.deleteIngredient({ id }));
  }

  updateIngredient(ingredient: PartialIngredient): void {
    this.store.dispatch(ShoppingListActions.updateIngredient({ ingredient }));
  }

  addIngredients(...ingredients: Ingredient[]): void {
    this.store.dispatch(ShoppingListActions.addIngredients({ ingredients }));
  }

  getSelectedIngredient(): Observable<Ingredient | undefined> {
    return this.store.select(fromShoppingList.getEditedIngredient);
  }

  selectIngredient(id: string): void {
    this.store.dispatch(ShoppingListActions.startEdit({ id }));
  }

  clearSelection(): void {
    this.store.dispatch(ShoppingListActions.stopEdit());
  }

  getIsLoaded(): Observable<boolean> {
    return this.store.select(fromShoppingList.getIsLoaded);
  }

  getError(): Observable<string | undefined> {
    return this.store.select(fromShoppingList.getError);
  }
}
