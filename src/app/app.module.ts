import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { KatexModule } from 'ng-katex';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LinearComponent } from './linear.component';
import { RouterModule } from '@angular/router';
import { NonLinearComponent } from './nonlinear.component';

@NgModule({
  declarations: [
    AppComponent,
    LinearComponent,
    NonLinearComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {path: 'linear', component: LinearComponent},
      {path: 'non-linear', component: NonLinearComponent},
    ]),
    FormsModule,
    KatexModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
