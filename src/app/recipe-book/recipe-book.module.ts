import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeItemComponent } from './recipe-item/recipe-item.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipesComponent } from './recipes/recipes.component';

@NgModule({
  declarations: [RecipeListComponent, RecipeItemComponent, RecipeDetailComponent, RecipesComponent],
  imports: [
    CommonModule
  ]
})
export class RecipeBookModule { }