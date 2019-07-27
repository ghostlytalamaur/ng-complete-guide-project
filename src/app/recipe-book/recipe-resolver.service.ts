import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Recipe } from './models/recipe';
import { Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import * as fromRecipes from './store/recipe.reducer';
import * as RecipeActions from '../recipe-book/store/recipe.actions';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';

@Injectable({
  providedIn: 'root'
})
export class RecipeResolverService implements Resolve<Recipe[]> {

  constructor(private readonly store: Store<fromRecipes.State>,
              private readonly actions$: Actions
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Recipe[]> | Promise<Recipe[]> | Recipe[] {
    console.log('Resolving data');
    return this.store.select(fromRecipes.selectRecipes)
      .pipe(
        take(1),
        switchMap(recipes => {
          // FIXME: recipes fetched after deleting all recipes and revisit page
          if (recipes.length === 0) {
            this.store.dispatch(RecipeActions.fetchRecipes());
            return this.actions$
              .pipe(
                ofType(RecipeActions.setRecipes),
                map(action => action.recipes),
                take(1)
              );
          } else {
            return of(recipes);
          }
        })
      );
  }

}
