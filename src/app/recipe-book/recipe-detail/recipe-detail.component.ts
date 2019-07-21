import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../models/recipe';
import { RecipesService } from '../services/recipes.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap, takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../shared/BaseComponent';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent extends BaseComponent implements OnInit {

  @Input()
  recipe: Recipe | undefined;

  constructor(
    private recipesService: RecipesService,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap(params => this.recipesService.getRecipe(params.id)),
        takeUntil(this.alive$)
      )
      .subscribe(
        recipe => this.recipe = recipe
      );
  }

  onAddToShoppingList(): void {
    if (this.recipe) {
      this.recipesService.addIngredientsToShoppingList(...this.recipe.ingredients);
    }
  }
}
