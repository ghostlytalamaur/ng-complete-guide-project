import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import * as RecipeActions from './recipe.actions';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { DataStorageService } from '../../shared/data-storage.service';
import { Injectable } from '@angular/core';
import * as fromRecipes from './recipe.reducer';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

@Injectable()
export class RecipeEffects {

  fetchRecipes$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(RecipeActions.fetchRecipes),
        switchMap(() => this.dataStorage.fetchRecipes()),
        map(recipes => RecipeActions.setRecipes({ recipes }))
      )
  );

  @Effect()
  storeRecipes$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(RecipeActions.storeRecipes),
        withLatestFrom(this.store.select(fromRecipes.selectRecipes)),
        switchMap(([ignored, recipes]) => this.handleStorageResult(this.dataStorage.storeRecipes(recipes)))
      )
  );

  updateEffect$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(RecipeActions.updateRecipe, RecipeActions.addRecipe),
        switchMap(action => this.handleStorageResult(this.dataStorage.updateRecipe(action.recipe)))
      )
  );

  deleteEffect$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(RecipeActions.deleteRecipe),
        switchMap(action => this.handleStorageResult(this.dataStorage.deleteRecipe(action.recipeId)))
      )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly dataStorage: DataStorageService,
    private readonly store: Store<fromRecipes.State>
  ) {
  }

  private handleStorageResult(data: Observable<void>): Observable<Action> {
    return data.pipe(
      map(() => RecipeActions.storeCompleted()),
      catchError((err: Error) => of(RecipeActions.storeFailed({ message: err.message })))
    );
  }
}
