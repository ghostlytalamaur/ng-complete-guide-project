import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../models/recipe';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.scss'],
  host: {
    class: 'list-group-item mouse-pointer'
  }
})
export class RecipeItemComponent implements OnInit {

  @Input()
  recipe: Recipe;

  ngOnInit(): void {
  }

}
