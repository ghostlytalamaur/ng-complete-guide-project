import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../../shared/models/ingredient';
import { IngredientsService } from '../services/ingredients.service';
import { Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../shared/BaseComponent';
import { Store } from '@ngrx/store';
import { State } from '../store/shopping-list.reducer';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromRoot from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent extends BaseComponent implements OnInit {

  ingredients$: Observable<State>;
  selectedIngredientId: string | undefined;

  constructor(
    private readonly ingredientsService: IngredientsService,
    private store: Store<fromRoot.AppState>
  ) {
    super();
  }

  ngOnInit(): void {
    this.ingredients$ = this.store.select('shoppingList');
    this.ingredients$
      .pipe(
        map(state => state.editedIngredientId),
        takeUntil(this.alive$)
      )
      .subscribe(editedIngredientId => {
        this.selectedIngredientId = editedIngredientId;
      });
  }

  onSelectIngredient(ingredient: Ingredient): void {
    this.store.dispatch(new ShoppingListActions.StartEdit(ingredient));
  }
}
