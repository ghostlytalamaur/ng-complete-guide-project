import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../../shared/models/ingredient';
import { IngredientsService } from '../services/ingredients.service';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../shared/BaseComponent';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../store/shopping-list.actions';
import { animate, group, keyframes, state, style, transition, trigger } from '@angular/animations';
import { fromShoppingList } from '../store';
import { selectShoppingListState } from '../store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
  animations: [
    trigger('ingredientsListItem',
      [
        state('in',
          style(
            {
              opacity: 1,
              transform: 'translateX(0)'
            }
          )
        ),
        transition('void => *',
          [
            animate(300,
              keyframes([
                style(
                  {
                    transform: 'translateX(-100px)',
                    opacity: 0,
                    offset: 0 // percent of animate timings
                  }
                ),
                style(
                  {
                    transform: 'translateX(-50px)',
                    opacity: 0.5,
                    offset: 0.4
                  }
                ),
                style(
                  {
                    transform: 'translate(-20px)',
                    opacity: 1,
                    offset: 0.8
                  }
                ),
                style(
                  {
                    transform: 'translate(0)',
                    opacity: 1,
                    offset: 1
                  }
                )
              ])
            )
          ]
        ),
        transition('* => void',
          [
            // group executed in parallel
            group([
              animate(300,
                style(
                  {
                    color: 'red'
                  }
                )
              ),
              animate(300,
                style(
                  {
                    opacity: 0,
                    transform: 'translate(100px)'
                  }
                )
              )
            ])
          ]
        )
      ]
    )
  ]
})
export class ShoppingListComponent extends BaseComponent implements OnInit {

  state: fromShoppingList.ShoppingListState;

  constructor(
    private readonly ingredientsService: IngredientsService,
    private store: Store<fromShoppingList.State>
  ) {
    super();
  }

  ngOnInit(): void {
    this.store.select(selectShoppingListState)
      .pipe(
        takeUntil(this.alive$)
      )
      .subscribe(s => this.state = s);
  }

  onSelectIngredient(ingredient: Ingredient): void {
    this.store.dispatch(ShoppingListActions.startEdit({ id: ingredient.id }));
  }
}
