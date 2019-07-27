import { Injectable } from '@angular/core';
import { Recipe } from '../recipe-book/models/recipe';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Ingredient } from './models/ingredient';
import * as uuid from 'uuid';

const ENDPOINT = 'https://ng-complete-guide-projec-84903.firebaseio.com/recipes.json';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(
    private readonly http: HttpClient
  ) {
  }

  storeRecipes(recipes: Recipe[]): Observable<{}> {
    return this.http.put(ENDPOINT, recipes)
      .pipe(
        catchError(() => throwError(new Error('Cannot store recipes')))
      );
  }

  fetchRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(ENDPOINT)
      .pipe(
        map(recipes => {
          return recipes.map(r => {
            const ingredients = r.ingredients ? r.ingredients.map(i => new Ingredient(uuid.v4(), i.name, i.amount)) : [];
            return new Recipe(r.id, r.name, r.description, r.imagePath, ingredients);
          });
        }),
        catchError(() => of([]))
      );
  }

}
