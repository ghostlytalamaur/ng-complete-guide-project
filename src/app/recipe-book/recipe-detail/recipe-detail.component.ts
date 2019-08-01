import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../models/recipe';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../shared/BaseComponent';
import { RecipesService } from '../services/recipes.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent extends BaseComponent implements OnInit {

  @Input()
  recipe: Recipe | undefined;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly service: RecipesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap(params => this.service.getRecipe(params.id)),
        takeUntil(this.alive$)
      )
      .subscribe(
        recipe => this.recipe = recipe
      );
  }

  onAddToShoppingList(): void {
    if (this.recipe) {
      this.service.addIngredientsToShoppingList(...this.recipe.ingredients);
    }
  }

  onDeleteRecipe(): void {
    if (this.recipe) {
      this.service.deleteRecipe(this.recipe.id);
      this.router.navigate(['../'], {relativeTo: this.route})
        .catch(console.log);
    }
  }

}
