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
import { animate, group, keyframes, state, style, transition, trigger } from '@angular/animations';

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
        map(storeState => storeState.editedIngredientId),
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
