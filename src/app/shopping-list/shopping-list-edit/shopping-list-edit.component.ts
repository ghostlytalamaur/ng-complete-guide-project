import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { findIngredient, Ingredient } from '../../shared/models/ingredient';
import { IngredientsService } from '../services/ingredients.service';
import { LogMethod } from '../../shared/logger.decorator';
import { distinctUntilChanged, map, switchMap, takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../shared/BaseComponent';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as uuid from 'uuid';
import * as fromRoot from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.scss']
})
export class ShoppingListEditComponent extends BaseComponent implements OnInit, OnDestroy {

  @ViewChild('frm', { static: false })
  form: NgForm;

  // @Output()
  // ingredientChange: EventEmitter<Ingredient | undefined> = new EventEmitter<Ingredient | undefined>();

  private mIngredient: Ingredient | undefined;

  constructor(
    private readonly ingredientsService: IngredientsService,
    private readonly store: Store<fromRoot.AppState>
  ) {
    super();
  }

  // @Input('ingredient')
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
    this.store.select('shoppingList')
      .pipe(
        map(state => state.ingredients.find(i => i.id === state.editedIngredientId)),
        takeUntil(this.alive$)
      )
      .subscribe(
        ingredient => this.ingredient = ingredient
      );

    setTimeout(() => {
      this.form.controls.ingredientName.valueChanges
        .pipe(
          distinctUntilChanged(),
          switchMap(ingredientName => {
            return this.store.select('shoppingList')
              .pipe(
                map(state => findIngredient(state.ingredients, ingredientName))
              );
          }),
          takeUntil(this.alive$)
        )
        .subscribe(ingredient => this.tryStartEdit(ingredient));
    }, 0);
  }

  ngOnDestroy(): void {
    this.store.dispatch(new ShoppingListActions.StopEdit());
    super.ngOnDestroy();
  }

  @LogMethod()
  addIngredient(): void {
    if (!this.form.valid) {
      return;
    }

    const newIngredient = new Ingredient(uuid.v4(), this.form.value.ingredientName, +this.form.value.amount);
    if (this.ingredient) {
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(
        { id: this.ingredient.id, amount: +this.form.value.amount }
      ));
    } else {
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }
  }

  clearIngredient(): void {
    this.store.dispatch(new ShoppingListActions.StopEdit());
    this.form.resetForm({
      amount: 1
    });
  }

  deleteIngredient(): void {
    if (this.mIngredient) {
      this.store.dispatch(new ShoppingListActions.DeleteIngredient(this.mIngredient));
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
      this.store.dispatch(new ShoppingListActions.StopEdit());
    }
    if (ingredient) {
      this.store.dispatch(new ShoppingListActions.StartEdit(ingredient));
    }
  }
}
