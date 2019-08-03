import { findIngredient, Ingredient } from '../../shared/models/ingredient';
import * as ShoppingListActions from './shopping-list.actions';
import { Action, createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { fromRoot } from '../../store';

export const shoppingListKey = 'shoppingList';

export interface ShoppingListState {
  ingredients: Ingredient[];
  loaded: boolean;
  error: string | undefined;
  editedIngredientId: string | undefined;
}

export interface State extends fromRoot.AppState {
  [shoppingListKey]: ShoppingListState;
}

const initialState: ShoppingListState = {
  ingredients: [],
  loaded: false,
  error: undefined,
  editedIngredientId: undefined
};

const shoppingListReducer = createReducer(initialState,
  on(ShoppingListActions.addIngredient, (state, { ingredient }) => {
    return {
      ...state,
      ingredients: state.ingredients.concat([ingredient])
    };
  }),

  on(ShoppingListActions.addIngredients, (state, { ingredients }) => {
    return {
      ...state,
      ingredients: state.ingredients.concat(ingredients)
    };
  }),

  on(ShoppingListActions.updateIngredient, (state, { ingredient }) => {
    const index = state.ingredients.findIndex(i => i.id === ingredient.id);
    if (index >= 0) {
      const updatedIngredients = [...state.ingredients];
      updatedIngredients[index] = state.ingredients[index].update(ingredient);
      return {
        ...state,
        ingredients: updatedIngredients
      };
    } else {
      return { ...state };
    }
  }),

  on(ShoppingListActions.deleteIngredient, (state, { id }) => {
    return {
      ...state,
      ingredients: state.ingredients.filter(Ingredient.notSameId(id)),
      editedIngredientId: state.editedIngredientId === id ? undefined : state.editedIngredientId
    };
  }),

  on(ShoppingListActions.setIngredients, (state, { ingredients }) => {
    return {
      ...state,
      ingredients: ingredients.slice(),
      loaded: true,
      error: undefined
    };
  }),

  on(ShoppingListActions.startEdit, (state, { id }) => {
    return {
      ...state,
      editedIngredientId: id
    };
  }),

  on(ShoppingListActions.stopEdit, (state, {}) => {
    return {
      ...state,
      editedIngredientId: undefined
    };
  }),

  on(ShoppingListActions.fetchIngredients, (state) => {
    return {
      ...state,
      loaded: false,
      error: undefined
    };
  }),

  on(ShoppingListActions.fetchFailed, (state, { message }) => {
    return {
      ...state,
      loaded: false,
      error: message
    };
  })
);

export function reducer(state: ShoppingListState | undefined, action: Action): ShoppingListState {
  return shoppingListReducer(state, action);
}

export const selectShoppingListState = createFeatureSelector<ShoppingListState>(shoppingListKey);
export const getEditedIngredientId = createSelector(
  selectShoppingListState,
  state => state.editedIngredientId
);

export const getIngredients = createSelector(
  selectShoppingListState,
  state => state.ingredients
);

export const getEditedIngredient = createSelector(
  selectShoppingListState,
  state => state.ingredients.find(i => i.id === state.editedIngredientId)
);

export const getIngredient = (name: string) =>
  createSelector(
    getIngredients,
    ingredients => findIngredient(ingredients, name)
  );

export const getIsLoaded = createSelector(
  selectShoppingListState,
  state => state.loaded
);


export const getError = createSelector(
  selectShoppingListState,
  state => state.error
);
