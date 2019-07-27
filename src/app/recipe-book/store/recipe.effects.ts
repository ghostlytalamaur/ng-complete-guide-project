import { Actions, Effect, ofType } from '@ngrx/effects';
import * as RecipeActions from './recipe.actions';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { DataStorageService } from '../../shared/data-storage.service';
import { Injectable } from '@angular/core';
import * as fromRecipes from './recipe.reducer';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Recipe } from '../models/recipe';

@Injectable()
export class RecipeEffects {

  @Effect()
  fetchRecipes = this.actions$
    .pipe(
      ofType(RecipeActions.fetchRecipes),
      switchMap(() => this.dataStorage.fetchRecipes()),
      map(recipes => RecipeActions.setRecipes({ recipes }))
    );

  @Effect()
  storeRecipes = this.actions$
    .pipe(
      ofType(RecipeActions.storeRecipes),
      withLatestFrom(this.store.select(fromRecipes.selectRecipes)),
      switchMap(([ignored, recipes]) => this.handleStoreRecipes(recipes))
    );

  constructor(
    private readonly actions$: Actions,
    private readonly dataStorage: DataStorageService,
    private readonly store: Store<fromRecipes.State>
  ) {
  }

  private handleStoreRecipes(recipes: Recipe[]): Observable<Action> {
    return this.dataStorage.storeRecipes(recipes)
      .pipe(
        map(() => RecipeActions.storeCompleted()),
        catchError(() => of(RecipeActions.storeFailed()))
      );
  }
}
