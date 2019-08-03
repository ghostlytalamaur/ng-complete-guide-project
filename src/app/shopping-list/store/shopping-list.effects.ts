import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { NotificationsActions } from '../../notifications/store';
import { ShoppingListActions } from './index';
import { IngredientsDataStorageService } from '../services/ingredients-data-storage.service';

@Injectable()
export class ShoppingListEffects {

  fetch$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(ShoppingListActions.fetchIngredients),
        switchMap(() => {
          return this.dataStorage.get()
            .pipe(
              map(ingredients => ShoppingListActions.setIngredients({ ingredients })),
              catchError((err: Error) => of(ShoppingListActions.fetchFailed({ message: `Cannot load ingredients\n${err.message}` })))
            );
        })
      )
  );

  update$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(ShoppingListActions.updateIngredient, ShoppingListActions.addIngredient),
        switchMap(action => this.handleStorageResult(this.dataStorage.update(action.ingredient)))
      )
  );

  updateAll$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(ShoppingListActions.addIngredients),
        switchMap(action => this.handleStorageResult(this.dataStorage.updateAll(...action.ingredients)))
      )
  );

  delete$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(ShoppingListActions.deleteIngredient),
        switchMap(action => this.handleStorageResult(this.dataStorage.delete(action.id)))
      )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly dataStorage: IngredientsDataStorageService
  ) {
  }

  private handleStorageResult(data: Observable<void>): Observable<Action> {
    return data.pipe(
      map(() => NotificationsActions.addNotification({ message: 'Ingredients was saved' })),
      catchError((err: Error) => of(NotificationsActions.addNotification({ message: err.message })))
    );
  }
}
