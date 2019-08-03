import { BaseDataStorageService } from '../../shared/base-data-storage.service';
import { Ingredient } from '../../shared/models/ingredient';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

function ingredientFactory(fields: Pick<Ingredient, keyof Ingredient>): Ingredient {
  return new Ingredient(fields.id, fields.name, fields.amount);
}

@Injectable({
  providedIn: 'root'
})
export class IngredientsDataStorageService extends BaseDataStorageService<Ingredient> {

  constructor(http: HttpClient) {
    super(http, 'ingredients', ingredientFactory);
  }

}
