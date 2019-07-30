import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as RecipeActions from './recipe.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { RecipesDataStorageService } from '../services/recipes-data-storage.service';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { NotificationsActions } from '../../notifications/store';

@Injectable()
export class RecipeEffects {

  fetchRecipes$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(RecipeActions.fetchRecipes),
        switchMap(() => this.dataStorage.get()),
        tap(recipes => console.log('Recipes', recipes)),
        map(recipes => RecipeActions.setRecipes({ recipes })),
        catchError((err: Error) => of(NotificationsActions.addNotification({ message: `Cannot load recipes\n${err.message}` })))
      )
  );

  updateEffect$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(RecipeActions.updateRecipe, RecipeActions.addRecipe),
        switchMap(action => this.handleStorageResult(this.dataStorage.update(action.recipe)))
      )
  );

  deleteEffect$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(RecipeActions.deleteRecipe),
        switchMap(action => this.handleStorageResult(this.dataStorage.delete(action.recipeId)))
      )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly dataStorage: RecipesDataStorageService
  ) {
  }

  private handleStorageResult(data: Observable<void>): Observable<Action> {
    return data.pipe(
      map(() => NotificationsActions.addNotification({ message: 'Recipes was saved' })),
      catchError((err: Error) => of(NotificationsActions.addNotification({ message: err.message })))
    );
  }
}
