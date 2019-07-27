import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BaseComponent } from '../../shared/BaseComponent';
import { switchMap, takeUntil } from 'rxjs/operators';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Recipe } from '../models/recipe';
import { Ingredient } from '../../shared/models/ingredient';
import * as uuid from 'uuid';
import * as fromRecipes from '../store/recipe.reducer';
import * as RecipesActions from '../store/recipe.actions';
import { Store } from '@ngrx/store';

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
    private readonly store: Store<fromRecipes.State>
  ) {
    super();
  }

  private static createIngredientsControls(ingredient: Ingredient | undefined): FormGroup {
    return new FormGroup({
      name: new FormControl(getProp(ingredient, 'name', ''), Validators.required),
      amount: new FormControl(getProp(ingredient, 'amount', 0), [
        Validators.required, Validators.pattern(/^[1-9]+\d*$/)
      ])
    });
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params: Params) => this.store.select(fromRecipes.selectRecipe(params.id))),
        takeUntil(this.alive$)
      )
      .subscribe((recipe: Recipe) => {
        this.recipe = recipe;
        this.editMode = !!recipe;
        this.initForm();
      });
  }

  onSubmit(): void {

    const ingredients = this.buildIngredients();
    const newRecipe = new Recipe(this.recipe && this.recipe.id || uuid.v4(),
      this.form.value.name,
      this.form.value.description,
      this.form.value.imagePath,
      ingredients
    );
    console.log('New recipe', newRecipe);
    const wasEditMode = this.editMode;
    if (this.editMode) {
      this.store.dispatch(RecipesActions.updateRecipe({ recipe: newRecipe }));
    } else {
      this.store.dispatch(RecipesActions.addRecipe({ recipe: newRecipe }));
    }

    if (wasEditMode) {
      this.router.navigate(['../'], { relativeTo: this.route })
        .catch(console.log);
    } else {
      this.router.navigate(['../', newRecipe.id], { relativeTo: this.route })
        .catch(console.log);
    }
  }

  addIngredient(): void {
    (this.form.get('ingredients') as FormArray).push(RecipeEditComponent.createIngredientsControls(undefined));
  }

  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route })
      .catch(console.log);
  }


  ingredientsControls(): FormArray {
    return this.form.get('ingredients') as FormArray;
  }

  private initForm(): void {
    const recipeName = getProp(this.recipe, 'name', '');
    const recipeDescription = getProp(this.recipe, 'description', '');
    const imagePath = getProp(this.recipe, 'imagePath', '');
    const ingredients = getProp(this.recipe, 'ingredients', []);
    const ingredientsControls = ingredients.map(ingredient => RecipeEditComponent.createIngredientsControls(ingredient));
    this.form = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(imagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: new FormArray(ingredientsControls)
    });
  }

  onDeleteIngredient(index: number): void {
    (this.form.controls.ingredients as FormArray).removeAt(index);
  }

  private buildIngredients(): Ingredient[] {
    const getId = (name: string): string => {
      let ingredient;
      if (this.recipe) {
        ingredient = this.recipe.ingredients.find(r => r.name === name);
      }
      if (ingredient) {
        return ingredient.id;
      } else {
        return uuid.v4();
      }
    };

    const values = this.form.value.ingredients as { name: string, amount: string }[];
    return values.map(i => new Ingredient(getId(i.name), i.name, +i.amount));
  }
}
