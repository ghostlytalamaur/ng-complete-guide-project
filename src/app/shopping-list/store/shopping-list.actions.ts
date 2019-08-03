import { Ingredient } from '../../shared/models/ingredient';
import { createAction, props } from '@ngrx/store';

export const addIngredient = createAction(
  '[Shopping List] Add Ingredient',
  props<{ ingredient: Ingredient }>()
);

export const addIngredients = createAction(
  '[Shopping List] Add Ingredients',
  props<{ ingredients: Ingredient[] }>()
);

export const updateIngredient = createAction(
  '[Shopping List] Update Ingredient',
  props<{ ingredient: { id: string } & Partial<Ingredient> }>()
);

export const deleteIngredient = createAction(
  '[Shopping List] Delete ingredient',
  props<{ id: string }>()
);

export const startEdit = createAction(
  '[Shopping List] Start Edit',
  props<{ id: string }>()
);

export const stopEdit = createAction(
  '[Shopping List] Stop Edit'
);

export const fetchIngredients = createAction(
  '[Shopping List] Fetch Ingredients'
);

export const fetchFailed = createAction(
  '[Shopping List] Fetch Failed',
  props<{ message: string }>()
);

export const setIngredients = createAction(
  '[Shopping List] Set Ingredients',
  props<{ ingredients: Ingredient[] }>()
);
