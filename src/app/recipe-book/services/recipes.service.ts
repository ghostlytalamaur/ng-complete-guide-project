import { Injectable } from '@angular/core';
import { Recipe } from '../models/recipe';
import { RecipesServiceModule } from './recipes-service.module';
import { Ingredient } from '../../shared/models/ingredient';
import { IngredientsService } from '../../shopping-list/services/ingredients.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: RecipesServiceModule
})
export class RecipesService {

  private readonly recipes: BehaviorSubject<Recipe[]> = new BehaviorSubject<Recipe[]>([
    new Recipe(
      '1',
      'Tasty Schnitzel',
      'This is simple a test',
      'https://storage.needpix.com/rsynced_images/recipe-575434_1280.png',
      [
        new Ingredient('Meat', 1),
        new Ingredient('Frech Fries', 20)
      ]
    ),
    new Recipe(
      '2',
      'Big Fat Burger',
      'This is second recipe',
      'https://storage.needpix.com/rsynced_images/recipe-575434_1280.png',
      [
        new Ingredient('Buns', 2),
        new Ingredient('Meat', 1),
        new Ingredient('Cheese', 2)
      ]
    )
  ]);

  constructor(
    private ingredientsService: IngredientsService
  ) {
    console.log('constructing RecipesService');
  }

  getRecipes(): Observable<Recipe[]> {
    return this.recipes.pipe(
      map(items => items.slice())
    );
  }

  getRecipe(id: string): Observable<Recipe | undefined> {
    return this.recipes.pipe(
      map(items => items.find(r => r.id === id))
    );
  }

  addIngredientsToShoppingList(...ingredients: Ingredient[]): void {
    this.ingredientsService.addIngredients(...ingredients);
  }
}

