import { Component, OnInit } from '@angular/core';
import { findIngredient, Ingredient } from '../../shared/models/ingredient';
import { IngredientsService } from '../services/ingredients.service';
import { Observable } from 'rxjs';
import { publishReplay, refCount, takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../shared/BaseComponent';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent extends BaseComponent implements OnInit {

  ingredients$: Observable<Ingredient[]>;
  private mSelectedIngredient: Ingredient | undefined;

  constructor(
    private readonly ingredientsService: IngredientsService
  ) {
    super();
  }

  get selectedIngredient(): Ingredient | undefined {
    return this.mSelectedIngredient;
  }

  set selectedIngredient(value: Ingredient | undefined) {
    console.log('[ShoppingListComponent] new ingredient', value);
    this.mSelectedIngredient = value;
  }

  ngOnInit(): void {
    this.ingredients$ = this.ingredientsService.getIngredients()
      .pipe(publishReplay(1), refCount())
    ;
    this.ingredients$
      .pipe(takeUntil(this.alive$))
      .subscribe((values) => {
        console.log('[ShoppingListComponent] new ingredient received');
        if (this.mSelectedIngredient) {
          this.selectedIngredient = findIngredient(values, this.mSelectedIngredient.name);
        }
      });
  }
}
