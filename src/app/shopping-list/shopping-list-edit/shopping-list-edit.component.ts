import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { findIngredient, Ingredient } from '../../shared/models/ingredient';
import { IngredientsService } from '../services/ingredients.service';
import { LogMethod } from '../../shared/logger.decorator';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../shared/BaseComponent';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.scss']
})
export class ShoppingListEditComponent extends BaseComponent implements OnInit, OnChanges {

  @ViewChild('frm', { static: false })
  form: NgForm;

  @Output()
  ingredientChange: EventEmitter<Ingredient | undefined> = new EventEmitter<Ingredient | undefined>();

  private mIngredient: Ingredient | undefined;
  private mIngredientName = '';
  private mIngredientAmount = 1;
  private ingredients: Ingredient[];

  constructor(
    private readonly ingredientsService: IngredientsService
  ) {
    super();
  }

  get ingredientName(): string {
    return this.mIngredientName;
  }

  set ingredientName(name: string) {
    this.mIngredientName = name;
    this.ingredient = findIngredient(this.ingredients, name);
  }

  get ingredientAmount(): string {
    return this.mIngredientAmount.toFixed();
  }

  set ingredientAmount(amountS: string) {
    console.log(typeof amountS, amountS, this.form);
    const newAmount = +amountS;
    if (newAmount && this.mIngredientAmount !== newAmount) {
      this.mIngredientAmount = newAmount;
      this.updateIngredient();
    }
  }

  @Input('ingredient')
  set ingredientFromOutside(ingredient: Ingredient | undefined) {
    if (ingredient !== this.ingredient) {
      console.log('[ShoppingListEditComponent] set ingredientFromOutside', ingredient);
      this.mIngredient = ingredient;
      this.mIngredientName = ingredient && ingredient.name || this.mIngredientName;
      this.mIngredientAmount = ingredient && ingredient.amount || this.mIngredientAmount;
    }
  }

  get ingredient(): Ingredient | undefined {
    return this.mIngredient;
  }

  set ingredient(ingredient: Ingredient | undefined) {
    if (ingredient !== this.ingredient) {
      this.ingredientFromOutside = ingredient;
      console.log('[ShoppingListEditComponent] emit ingredientChange');
      this.ingredientChange.emit(this.ingredient);
    }
  }

  ngOnInit(): void {
    this.ingredientsService.getIngredients()
      .pipe(takeUntil(this.alive$))
      .subscribe(
        (value) => {
          console.log('[ShoppingListEditComponent] new ingredients received');
          this.ingredients = value;
          this.ingredient = findIngredient(value, this.mIngredientName);
        }
      );
  }

  @LogMethod()
  ngOnChanges(changes: SimpleChanges): void {
  }

  addIngredient(): void {
    if (this.form.valid) {
      this.ingredientsService.addIngredient(new Ingredient(this.mIngredientName, this.mIngredientAmount));
    }
  }

  clearIngredient(): void {
    this.mIngredientName = '';
    this.mIngredientAmount = 1;
    this.ingredient = undefined;
  }

  deleteIngredient(): void {
    this.ingredientsService.deleteIngredient(this.mIngredientName);
  }

  private updateIngredient(): void {
    if (this.form.valid) {
      this.ingredientsService.updateIngredient({
        name: this.mIngredientName,
        amount: this.mIngredientAmount
      });
    }
  }

}
