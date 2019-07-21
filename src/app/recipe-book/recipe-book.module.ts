import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeItemComponent } from './recipe-item/recipe-item.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipesComponent } from './recipes/recipes.component';
import { MatButtonModule, MatListModule, MatMenuModule } from '@angular/material';
import { RecipesServiceModule } from './services/recipes-service.module';
import { RecipeBookRouterModule } from './recipe-book-router.module';
import { RecipeEditComponent } from './recipe-edit-component/recipe-edit.component';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';

@NgModule({
  declarations: [
    RecipeListComponent,
    RecipeItemComponent,
    RecipeDetailComponent,
    RecipesComponent,
    RecipeEditComponent,
    RecipeStartComponent
  ],
  exports: [
    RecipesComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    RecipesServiceModule,
    RecipeBookRouterModule
  ]
})
export class RecipeBookModule {
  constructor() {
    console.log('constructing RecipeBookModule');
  }
}
