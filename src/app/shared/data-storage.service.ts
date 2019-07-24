import { Injectable } from '@angular/core';
import { Recipe } from '../recipe-book/models/recipe';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RecipesService } from '../recipe-book/services/recipes.service';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Ingredient } from './models/ingredient';

const ENDPOINT = 'https://ng-complete-guide-projec-84903.firebaseio.com/recipes.json';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private readonly http: HttpClient,
              private readonly recipeService: RecipesService) {
  }

  storeRecipes(): void {
    const recipes$ = this.recipeService.getRecipes();
    recipes$
      .pipe(
        switchMap(recipes => this.http.put(ENDPOINT, recipes))
      )
      .subscribe(response => {
        console.log(response);
      });
  }

  fetchRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(ENDPOINT)
      .pipe(
        map(recipes => {
          return recipes.map(r => {
            const ingredients = r.ingredients ? r.ingredients.map(i => new Ingredient(i.name, i.amount)) : [];
            return new Recipe(r.id, r.name, r.description, r.imagePath, ingredients);
          });
        }),
        tap(recipes => this.recipeService.setRecipes(...recipes)),
        catchError(err => of([]))
      );
  }

  // storeRecipes(): void {}
  // fetchRecipes(): Observable<Recipe[]> {
  //   return of([]);
  // }

}
