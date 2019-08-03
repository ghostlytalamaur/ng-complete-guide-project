import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../../shared/models/ingredient';
import { IngredientsService } from '../services/ingredients.service';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../shared/BaseComponent';
import { animate, group, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';

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

  ingredients$: Observable<Ingredient[]>;
  selectedIngredient: Ingredient | undefined;
  isLoaded = false;
  error: string | undefined;

  constructor(
    private readonly ingredientsService: IngredientsService,
  ) {
    super();
    this.ingredients$ = this.ingredientsService.getIngredients();
  }

  ngOnInit(): void {
    this.ingredientsService.loadIngredients();
    this.ingredientsService.getSelectedIngredient()
      .pipe(
        takeUntil(this.alive$)
      )
      .subscribe(ingredient => this.selectedIngredient = ingredient);

    this.ingredientsService.getIsLoaded()
      .pipe(
        takeUntil(this.alive$)
      )
      .subscribe(isLoaded => this.isLoaded = isLoaded);

    this.ingredientsService.getError()
      .pipe(
        takeUntil(this.alive$)
      )
      .subscribe(message => this.error = message);
  }

  onSelectIngredient(ingredient: Ingredient): void {
    this.ingredientsService.selectIngredient(ingredient.id);
  }

  onRefresh(): void {
    this.ingredientsService.loadIngredients();
  }
}
