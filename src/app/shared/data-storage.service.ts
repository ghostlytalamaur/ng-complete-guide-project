import { Injectable } from '@angular/core';
import { PartialRecipe, Recipe } from '../recipe-book/models/recipe';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Ingredient } from './models/ingredient';
import * as uuid from 'uuid';

const ENDPOINT = 'https://ng-complete-guide-projec-84903.firebaseio.com';
const RECIPES_ENDPOINT = `${ENDPOINT}/recipes.json`;
const getRecipeUrl = (id: string) => `${ENDPOINT}/recipes/${id}.json`;

interface RecipesData {
  [id: string]: Recipe;
}

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(
    private readonly http: HttpClient
  ) {
  }

  private static handleErrorResponse(errRes: HttpErrorResponse): Observable<void> {
    let errorMessage = '';
    switch (errRes.status) {
      case 401:
        errorMessage = 'Unauthorized.';
        break;
      case 404:
        errorMessage = 'Database was not found';
        break;
      case 500:
        errorMessage = 'Internal Server Error';
        break;
      case 503:
        errorMessage = 'Service Unavailable';
        break;
      default:
        errorMessage = 'Unknown error occurs during update recipe';
        break;
    }

    return throwError(new Error(errorMessage));
  }

  storeRecipes(recipes: Recipe[]): Observable<void> {
    const data: RecipesData = recipes.reduce<RecipesData>((acc, recipe) => {
      acc[recipe.id] = recipe;
      return acc;
    }, {});
    return this.http.put(RECIPES_ENDPOINT, data)
      .pipe(
        map(() => {
        }),
        catchError(() => throwError(new Error('Cannot store recipes')))
      );
  }

  fetchRecipes(): Observable<Recipe[]> {
    return this.http.get<RecipesData>(RECIPES_ENDPOINT)
      .pipe(
        map(data => {
          const recipes: Recipe[] = [];
          for (const id of Object.keys(data)) {
            const r = data[id];
            const ingredients = r.ingredients ? r.ingredients.map(i => new Ingredient(uuid.v4(), i.name, i.amount)) : [];
            const recipe = new Recipe(r.id, r.name, r.description, r.imagePath, ingredients);
            recipes.push(recipe);
          }
          return recipes;
        }),
        catchError(() => of([]))
      );
  }

  updateRecipe(recipe: Recipe | PartialRecipe): Observable<void> {
    const url = getRecipeUrl(recipe.id);
    return this.http.patch(url, recipe)
      .pipe(
        map(() => {
        }),
        catchError(errRes => DataStorageService.handleErrorResponse(errRes))
      );
  }

  deleteRecipe(recipeId: string): Observable<void> {
    return this.http.delete(getRecipeUrl(recipeId))
      .pipe(
        map(() => {
        }),
        catchError(errRes => DataStorageService.handleErrorResponse(errRes))
      );
  }
}
