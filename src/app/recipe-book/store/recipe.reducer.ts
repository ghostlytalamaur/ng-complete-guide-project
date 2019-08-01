import { Recipe } from '../models/recipe';
import * as RecipeActions from './recipe.actions';
import { Action, createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { fromRoot } from '../../store';

export const recipesFeatureKey = 'recipes';

export interface RecipesState {
  recipes: Recipe[];
  storageError: string | undefined;
  loaded: boolean;
  fetchError: string | undefined;
}

export interface State extends fromRoot.AppState {
  [recipesFeatureKey]: RecipesState;
}

const initialState: RecipesState = {
  recipes: [],
  storageError: undefined,
  loaded: false,
  fetchError: undefined
};

const recipeReducer = createReducer<RecipesState>(initialState,
  on(RecipeActions.setRecipes, (state, { recipes }) => {
    console.log('Set recipes');
    return {
      ...state,
      recipes: recipes.slice(),
      loaded: true,
      fetchError: undefined
    };
  }),

  on(RecipeActions.addRecipe, (state, { recipe }) => {
    return {
      ...state,
      recipes: state.recipes.concat([recipe])
    };
  }),

  on(RecipeActions.updateRecipe, (state, { recipe }) => {
    console.log('Update recipe');
    const idx = state.recipes.findIndex(r => r.id === recipe.id);
    if (idx >= 0) {
      const newRecipes = state.recipes.slice();
      newRecipes[idx] = newRecipes[idx].update(recipe);
      return {
        ...state,
        recipes: newRecipes
      };
    } else {
      return {
        ...state
      };
    }
  }),

  on(RecipeActions.deleteRecipe, (state, { recipeId }) => {
    return {
      ...state,
      recipes: state.recipes.filter(r => r.id !== recipeId)
    };
  }),

  on(RecipeActions.storeCompleted, (state) => {
    return {
      ...state,
      storageError: undefined
    };
  }),

  on(RecipeActions.storeFailed, (state, { message }) => {
    return {
      ...state,
      storageError: message
    };
  }),

  on(RecipeActions.fetchRecipes, (state) => {
    console.log('Fetch recipes');
    return {
      ...state,
      fetchError: undefined,
      loaded: false
    };
  }),

  on(RecipeActions.fetchFailed, (state, { message }) => {
    return {
      ...state,
      fetchError: message,
      loaded: false
    };
  })
);

export function reducers(state: RecipesState | undefined, action: Action): RecipesState {
  return recipeReducer(state, action);
}

export const selectRecipesState = createFeatureSelector<RecipesState>(recipesFeatureKey);

export const getRecipes = createSelector(
  selectRecipesState,
  (state) => state.recipes
);

export const getRecipe = (id: string) => createSelector(
  getRecipes,
  recipes => recipes.find(r => r.id === id)
);

export const getFetchError = createSelector(
  selectRecipesState,
  state => state.fetchError
);

export const getIsLoaded = createSelector(
  selectRecipesState,
  state => state.loaded
);
