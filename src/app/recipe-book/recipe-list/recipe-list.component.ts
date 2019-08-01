import { Component, OnInit } from '@angular/core';
import { Recipe } from '../models/recipe';
import { Observable } from 'rxjs';
import { BaseComponent } from '../../shared/BaseComponent';
import { RecipesService } from '../services/recipes.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent extends BaseComponent implements OnInit {

  recipes$: Observable<Recipe[]>;

  constructor(
    private readonly service: RecipesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.recipes$ = this.service.getRecipes();
  }
}
