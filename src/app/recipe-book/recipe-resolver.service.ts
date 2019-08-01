import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Recipe } from './models/recipe';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { RecipesService } from './services/recipes.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeResolverService implements Resolve<Recipe[]> {

  constructor(
    private service: RecipesService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Recipe[]> | Promise<Recipe[]> | Recipe[] {
    console.log('Resolving data');
    this.service.loadRecipes();
    return this.service.getRecipes()
      .pipe(
        take(1)
      );
  }

}
