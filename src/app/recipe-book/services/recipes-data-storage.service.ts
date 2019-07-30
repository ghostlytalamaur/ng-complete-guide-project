import { Injectable } from '@angular/core';
import { Recipe } from '../models/recipe';
import { HttpClient } from '@angular/common/http';
import { Ingredient } from '../../shared/models/ingredient';
import * as uuid from 'uuid';
import { BaseDataStorageService } from '../../shared/base-data-storage.service';

function recipeFactory(data: Pick<Recipe, keyof Recipe>): Recipe {
  const ingredients = data.ingredients ? data.ingredients.map(i => new Ingredient(uuid.v4(), i.name, i.amount)) : [];
  return new Recipe(data.id, data.name, data.description, data.imagePath, ingredients);
}

@Injectable({
  providedIn: 'root'
})
export class RecipesDataStorageService extends BaseDataStorageService<Recipe> {

  constructor(http: HttpClient) {
    super(http, 'recipes', recipeFactory);
  }

}
