import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Recipe } from './models/recipe';
import { Observable } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipesService } from './services/recipes.service';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RecipeResolverService implements Resolve<Recipe[]> {

  constructor(private readonly dataStorageService: DataStorageService,
              private readonly recipeService: RecipesService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Recipe[]> | Promise<Recipe[]> | Recipe[] {
    console.log('Resolving data');
    if (this.recipeService.hasRecipes()) {
      return this.recipeService.getRecipes().pipe(first());
    } else {
      return this.dataStorageService.fetchRecipes();
    }
  }

}
