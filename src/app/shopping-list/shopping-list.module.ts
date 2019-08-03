import { NgModule } from '@angular/core';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ShoppingListEditComponent } from './shopping-list-edit/shopping-list-edit.component';
import { MatButtonModule, MatInputModule, MatProgressSpinnerModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ShoppingListRouterModule } from './shopping-list-router.module';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { fromShoppingList } from './store';
import { EffectsModule } from '@ngrx/effects';
import { ShoppingListEffects } from './store/shopping-list.effects';

@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingListEditComponent
  ],
  exports: [
    ShoppingListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ShoppingListRouterModule,
    StoreModule.forFeature(fromShoppingList.shoppingListKey, fromShoppingList.reducer),
    EffectsModule.forFeature([ShoppingListEffects])
  ]
})
export class ShoppingListModule { }
