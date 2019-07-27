import { Ingredient } from '../../shared/models/ingredient';
import * as ShoppingListActions from './shopping-list.actions';
import * as uuid from 'uuid';

export interface State {
  ingredients: Ingredient[];
  editedIngredientId: string | undefined;
}

const initialState: State = {
  ingredients: [
    new Ingredient(uuid.v4(), 'Cheese', 1),
    new Ingredient(uuid.v4(), 'Bacon', 1)
  ],
  editedIngredientId: undefined
};

export function shoppingListReducer(state: State = initialState, action: ShoppingListActions.ShoppingListActions): State {
  switch (action.type) {
    case ShoppingListActions.ActionType.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload]
      };

    case ShoppingListActions.ActionType.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload]
      };

    case ShoppingListActions.ActionType.UPDATE_INGREDIENT:
      const index = state.ingredients.findIndex(i => i.id === action.payload.id);
      if (index >= 0) {
        const updatedIngredients = [...state.ingredients];
        updatedIngredients[index] = state.ingredients[index].update(action.payload);
        return {
          ...state,
          ingredients: updatedIngredients
        };
      } else {
        return { ...state };
      }

    case ShoppingListActions.ActionType.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter(Ingredient.notSameId(action.payload.id)),
        editedIngredientId: state.editedIngredientId === action.payload.id ? undefined : state.editedIngredientId
      };

    case ShoppingListActions.ActionType.START_EDIT:
      console.log('Start edit', action.payload);
      return {
        ...state,
        editedIngredientId: action.payload.id
      };

    case ShoppingListActions.ActionType.END_EDIT:
      console.log('Stop edit', state.editedIngredientId);
      return {
        ...state,
        editedIngredientId: undefined
      };

    default:
      return state;
  }
}
