import { Injectable } from '@angular/core';
import { Ingredient, PartialIngredient } from '../../shared/models/ingredient';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { fromShoppingList, ShoppingListActions } from '../store';

@Injectable({
  providedIn: 'root'
})
export class IngredientsService {

  constructor(
    private readonly store: Store<fromShoppingList.State>
  ) {
    console.log('constructing IngredientsService');
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

}
