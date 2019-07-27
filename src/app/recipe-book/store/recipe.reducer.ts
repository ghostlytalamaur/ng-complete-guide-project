import { Recipe } from '../models/recipe';
import * as RecipeActions from './recipe.actions';
import { Action, createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as fromRoot from '../../store/app.reducer';

export const recipesFeatureKey = 'recipes';

export interface RecipesState {
  recipes: Recipe[];
}

export interface State extends fromRoot.AppState {
  [recipesFeatureKey]: RecipesState;
}

const initialState: RecipesState = {
  recipes: []
};

const recipeReducer = createReducer<RecipesState>(initialState,
  on(RecipeActions.setRecipes, (state, { recipes }) => {
    return {
      ...state,
      recipes: recipes.slice()
    };
  }),

  on(RecipeActions.addRecipe, (state, { recipe }) => {
    return {
      ...state,
      recipes: state.recipes.concat([recipe])
    };
  }),

  on(RecipeActions.updateRecipe, (state, { recipe }) => {
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
  })
);

export function reducers(state: RecipesState | undefined, action: Action): RecipesState {
  return recipeReducer(state, action);
}

export const selectRecipesState = createFeatureSelector<RecipesState>(recipesFeatureKey);

export const selectRecipes = createSelector(
  selectRecipesState,
  (state) => state.recipes
);

export const selectRecipe = (id: string) => createSelector(
  selectRecipes,
  recipes => recipes.find(r => r.id === id)
);
