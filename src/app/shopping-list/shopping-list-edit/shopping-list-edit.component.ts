import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Ingredient } from '../../shared/models/ingredient';
import { IngredientsService } from '../services/ingredients.service';
import { LogMethod } from '../../shared/logger.decorator';
import { distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../shared/BaseComponent';
import { NgForm } from '@angular/forms';
import * as uuid from 'uuid';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.scss']
})
export class ShoppingListEditComponent extends BaseComponent implements OnInit, OnDestroy {

  @ViewChild('frm', { static: false })
  form: NgForm;

  private mIngredient: Ingredient | undefined;

  constructor(
    private readonly ingredientsService: IngredientsService,
  ) {
    super();
  }

  set ingredient(ingredient: Ingredient | undefined) {
    console.log('[ShoppingListEditComponent] set ingredient', ingredient);
    if (this.form && ingredient) {
      this.form.form.patchValue({
        ingredientName: ingredient.name,
        amount: ingredient.amount
      });
    }
    this.mIngredient = ingredient;
  }

  get ingredient(): Ingredient | undefined {
    return this.mIngredient;
  }

  @LogMethod()
  ngOnInit(): void {
    this.ingredientsService.getSelectedIngredient()
      .pipe(
        takeUntil(this.alive$)
      )
      .subscribe(
        ingredient => this.ingredient = ingredient
      );

    setTimeout(() => {
      this.form.controls.ingredientName.valueChanges
        .pipe(
          distinctUntilChanged(),
          switchMap((ingredientName: string) => this.ingredientsService.getIngredient(ingredientName)),
          takeUntil(this.alive$)
        )
        .subscribe(ingredient => this.tryStartEdit(ingredient));
    }, 0);
  }

  ngOnDestroy(): void {
    this.ingredientsService.clearSelection();
    super.ngOnDestroy();
  }

  @LogMethod()
  addIngredient(): void {
    if (!this.form.valid) {
      return;
    }

    const newIngredient = new Ingredient(uuid.v4(), this.form.value.ingredientName, +this.form.value.amount);
    if (this.ingredient) {
      this.ingredientsService.updateIngredient(newIngredient);
    } else {
      this.ingredientsService.addIngredient(newIngredient);
    }
  }

  clearIngredient(): void {
    this.ingredientsService.clearSelection();
    this.form.resetForm({
      amount: 1
    });
  }

  deleteIngredient(): void {
    if (this.mIngredient) {
      this.ingredientsService.deleteIngredient(this.mIngredient.id);
      this.form.resetForm({
        amount: 1
      });
    }
  }

  private tryStartEdit(ingredient: Ingredient | undefined): void {
    console.log('tryStartEdit, old = ', this.mIngredient, ' new = ', ingredient);
    if (ingredient === this.mIngredient) {
      return;
    }
    if (this.mIngredient) {
      this.ingredientsService.clearSelection();
    }
    if (ingredient) {
      this.ingredientsService.selectIngredient(ingredient.id);
    }
  }
}
