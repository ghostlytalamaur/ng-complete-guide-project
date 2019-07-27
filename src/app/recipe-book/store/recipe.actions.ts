import { createAction, props } from '@ngrx/store';
import { Recipe } from '../models/recipe';

export const ADD_RECIPE = '[Recipes] Add Recipe';
export const UPDATE_RECIPE = '[Recipes] Update Recipe';
export const DELETE_RECIPE = '[Recipes] Delete Recipe';

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
  props<{ recipe: { id: string } & Partial<Recipe> }>()
);

export const fetchRecipes = createAction(
  '[Recipes] Fetch Recipes'
);

export const storeRecipes = createAction(
  '[Recipes] Store Recipes'
);

export const storeCompleted = createAction(
  '[Recipes] Store Completed'
);

export const storeFailed = createAction(
  '[Recipes] Store Failed'
);
