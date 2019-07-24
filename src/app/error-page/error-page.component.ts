import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../shared/BaseComponent';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent extends BaseComponent implements OnInit {

  message: string;

  constructor(
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.data
      .pipe(
        takeUntil(this.alive$)
      )
      .subscribe((data: Data) => this.message = data.message);
  }

}
