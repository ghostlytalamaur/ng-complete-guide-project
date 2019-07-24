import { NgModule } from '@angular/core';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ShoppingListEditComponent } from './shopping-list-edit/shopping-list-edit.component';
import { MatButtonModule, MatInputModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ShoppingListRouterModule } from './shopping-list-router.module';
import { CommonModule } from '@angular/common';

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
    ShoppingListRouterModule
  ]
})
export class ShoppingListModule { }
