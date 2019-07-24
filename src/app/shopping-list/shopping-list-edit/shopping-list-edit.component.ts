import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { findIngredient, Ingredient } from '../../shared/models/ingredient';
import { IngredientsService } from '../services/ingredients.service';
import { LogMethod } from '../../shared/logger.decorator';
import { distinctUntilChanged, map, switchMap, takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../shared/BaseComponent';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.scss']
})
export class ShoppingListEditComponent extends BaseComponent implements OnInit {

  @ViewChild('frm', { static: false })
  form: NgForm;

  @Output()
  ingredientChange: EventEmitter<Ingredient | undefined> = new EventEmitter<Ingredient | undefined>();

  private mIngredient: Ingredient | undefined;

  constructor(
    private readonly ingredientsService: IngredientsService
  ) {
    super();
  }

  @Input('ingredient')
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
    setTimeout(() => {
      this.form.controls.ingredientName.valueChanges
        .pipe(
          distinctUntilChanged(),
          switchMap(ingredientName => this.ingredientsService.getIngredient(ingredientName)),
          takeUntil(this.alive$)
        )
        .subscribe(ingredient => this.ingredientChange.emit(ingredient));
    }, 0);
  }

  @LogMethod()
  addIngredient(): void {
    if (!this.form.valid) {
      return;
    }

    if (!this.ingredientsService.updateIngredient({ name: this.form.value.ingredientName, amount: +this.form.value.amount })) {
      this.ingredientsService.addIngredient(new Ingredient(this.form.value.ingredientName, +this.form.value.amount));
    }
  }

  clearIngredient(): void {
    this.form.resetForm({
      amount: 1
    });
  }

  deleteIngredient(): void {
    this.ingredientsService.deleteIngredient(this.form.value.ingredientName);
  }

}
