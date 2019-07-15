import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ShoppingListEditComponent } from './shopping-list-edit/shopping-list-edit.component';
import { IngredientComponent } from './ingredient/ingredient.component';

@NgModule({
  declarations: [ShoppingListComponent, ShoppingListEditComponent, IngredientComponent],
  imports: [
    CommonModule
  ]
})
export class ShoppingListModule { }
