import { createAction, props } from '@ngrx/store';
import { PartialRecipe, Recipe } from '../models/recipe';

export const setRecipes = createAction(
  '[Recipes] Set Recipes',
  props<{ recipes: Recipe[] }>()
);

export const addRecipe = createAction(
  '[Recipes] Add Recipe',
  props<{ recipe: Recipe }>()
);

export const deleteRecipe = createAction(
  '[Recipes] Delete Recipe',
  props<{ recipeId: string }>()
);

export const updateRecipe = createAction(
  '[Recipes] Update Recipe',
  props<{ recipe: PartialRecipe }>()
);

export const fetchRecipes = createAction(
  '[Recipes] Fetch Recipes'
);

export const storeCompleted = createAction(
  '[Recipes] Store Completed'
);

export const storeFailed = createAction(
  '[Recipes] Store Failed',
  props<{ message: string }>()
);
