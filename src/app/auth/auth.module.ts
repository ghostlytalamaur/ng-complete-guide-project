import { NgModule } from '@angular/core';
import { AuthComponent } from './auth.component';
import { MatButtonModule, MatProgressSpinnerModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthRouterModule } from './auth-router.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    AuthComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    SharedModule,
    AuthRouterModule
  ]
})
export class AuthModule {}
