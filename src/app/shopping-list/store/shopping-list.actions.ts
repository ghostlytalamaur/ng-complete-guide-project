import { Action } from '@ngrx/store/src/models';
import { Ingredient } from '../../shared/models/ingredient';

export enum ActionType {
  ADD_INGREDIENT = '[Shopping list] Add ingredient',
  ADD_INGREDIENTS = '[Shopping list] Add ingredients',
  UPDATE_INGREDIENT = '[Shopping list] Update ingredient',
  DELETE_INGREDIENT = '[Shopping list] Delete ingredient',
  START_EDIT = '[ShoppingList] Start edit',
  END_EDIT = '[ShoppingList] End edit'
}

export class AddIngredient implements Action {
  readonly type = ActionType.ADD_INGREDIENT;

  constructor(public readonly payload: Ingredient) {
  }
}

export class AddIngredients implements Action {
  readonly type = ActionType.ADD_INGREDIENTS;

  constructor(public readonly payload: Ingredient[]) {
  }
}

export class UpdateIngredient implements Action {
  readonly type = ActionType.UPDATE_INGREDIENT;

  constructor(public readonly payload: { id: string } & Partial<Ingredient>) {
  }
}

export class DeleteIngredient implements Action {
  readonly type = ActionType.DELETE_INGREDIENT;

  constructor(public readonly payload: { id: string }) {
  }
}

export class StartEdit implements Action {
  readonly type = ActionType.START_EDIT;

  constructor(public readonly payload: { id: string }) {
  }
}

export class StopEdit implements Action {
  readonly type = ActionType.END_EDIT;
}

export type ShoppingListActions = AddIngredient |
  AddIngredients |
  UpdateIngredient |
  DeleteIngredient |
  StartEdit |
  StopEdit;
