import { Injectable } from '@angular/core';
import { findIngredient, findIngredientIndex, Ingredient } from '../../shared/models/ingredient';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IngredientsService {

  private readonly ingredients: Ingredient[] = [
    new Ingredient('Cheese', 1),
    new Ingredient('Bacon', 1)
  ];
  private readonly ingredients$: BehaviorSubject<Ingredient[]>;

  constructor() {
    console.log('constructing IngredientsService');
    this.ingredients$ = new BehaviorSubject<Ingredient[]>(this.ingredients);
  }

  getIngredients(): Observable<Ingredient[]> {
    return this.ingredients$.pipe(
      map(ingredients => ingredients.slice()),
      tap(console.log)
    );
  }

  getIngredient(name: string): Observable<Ingredient | undefined> {
    return this.ingredients$.pipe(
      map(ingredients => findIngredient(ingredients, name))
    );
  }

  addIngredient(ingredient: Ingredient): boolean {
    const wasUpdated = this.doAddIngredient(ingredient);
    if (wasUpdated) {
      this.ingredients$.next(this.ingredients);
    }

    return wasUpdated;
  }

  deleteIngredient(ingredientName: string): boolean {
    const index = findIngredientIndex(this.ingredients, ingredientName);
    if (index >= 0) {
      this.ingredients.splice(index, 1);
      this.ingredients$.next(this.ingredients);
      return true;
    }
    return false;
  }

  updateIngredient(ingredient: { name: string } & Partial<Ingredient>): boolean {
    const index = findIngredientIndex(this.ingredients, ingredient.name);
    if (index >= 0) {
      this.ingredients[index] = this.ingredients[index].update(ingredient);
      this.ingredients$.next(this.ingredients);
      return true;
    } else {
      return false;
    }
  }

  addIngredients(...ingredients: Ingredient[]): void {
    const wasUpdated = ingredients.reduce((wu, ingredient) => this.doAddIngredient(ingredient) || wu, false);
    if (wasUpdated) {
      this.ingredients$.next(this.ingredients);
    }
  }

  private doAddIngredient(ingredient: Ingredient): boolean {
    return ingredient && (this.doMergeIngredient(ingredient) || this.ingredients.push(ingredient) >= 0);
  }

  private doMergeIngredient(ingredient: Partial<Ingredient> & { name: string }): boolean {
    const index = findIngredientIndex(this.ingredients, ingredient.name);
    if (index >= 0) {
      this.ingredients[index] = this.ingredients[index].merge(ingredient);
      return true;
    } else {
      return false;
    }
  }
}
