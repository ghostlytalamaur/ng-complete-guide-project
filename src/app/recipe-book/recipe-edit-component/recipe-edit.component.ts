import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../shared/BaseComponent';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { RecipesService } from '../services/recipes.service';
import { Recipe } from '../models/recipe';
import { Ingredient } from '../../shared/models/ingredient';
import * as uuid from 'uuid';

function getProp<T, K extends keyof T>(obj: T | undefined, prop: K, def: T[K]): T[K] {
  return obj && obj[prop] || def;
}

@Component({
  selector: 'app-recipe-edit-component',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss']
})
export class RecipeEditComponent extends BaseComponent implements OnInit {

  recipe: Recipe | undefined;
  editMode: boolean;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap(params => this.recipeService.getRecipe(params.id)),
        takeUntil(this.alive$)
      )
      .subscribe((recipe: Recipe) => {
        this.recipe = recipe;
        this.editMode = !!recipe;
        this.initForm();
      });
  }

  private initForm(): void {
    const recipeName = getProp(this.recipe, 'name', '');
    const recipeDescription = getProp(this.recipe, 'description', '');
    const imagePath = getProp(this.recipe, 'imagePath', '');
    const ingredients = getProp(this.recipe, 'ingredients', []);
    const ingredientsControls = ingredients.map(ingredient => this.createIngredientsControls(ingredient));
    this.form = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(imagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: new FormArray(ingredientsControls)
    });
  }

  private createIngredientsControls(ingredient: Ingredient | undefined): FormGroup {
    return new FormGroup({
      name: new FormControl(getProp(ingredient, 'name', ''), Validators.required),
      amount: new FormControl(getProp(ingredient, 'amount', 0), [
        Validators.required, Validators.pattern(/^[1-9]+\d*$/)
      ])
    });
  }

  onSubmit(): void {

    // @ts-ignore
    const ingredients = this.form.value.ingredients.map(i => new Ingredient(i.name, i.amount));
    console.log(ingredients);
    const newRecipe = new Recipe(this.recipe && this.recipe.id || uuid.v4(),
      this.form.value.name,
      this.form.value.description,
      this.form.value.imagePath,
      ingredients
    );
    console.log('New recipe', newRecipe);
    const wasEditMode = this.editMode;
    if (this.editMode) {
      this.recipeService.updateRecipe(newRecipe);
    } else {
      this.recipeService.addRecipe(newRecipe);
    }

    if (wasEditMode) {
      this.router.navigate(['../'], { relativeTo: this.route })
        .catch(console.log);
    } else {
      this.router.navigate(['../', newRecipe.id], { relativeTo: this.route })
        .catch(console.log);
    }
  }

  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route })
      .catch(console.log);
  }


  ingredientsControls(): FormArray {
    return this.form.get('ingredients') as FormArray;
  }

  addIngredient(): void {
    (this.form.get('ingredients') as FormArray).push(this.createIngredientsControls(undefined));
  }

  onDeleteIngredient(index: number): void {
    (this.form.controls.ingredients as FormArray).removeAt(index);
  }

}
