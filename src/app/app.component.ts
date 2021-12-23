import { Component } from '@angular/core';

enum StepID {
  EQUATIONS = 'EQUATIONS',
  METHOD = 'METHOD',
  LU_PARAM= 'LU_PARAM',
  SEIDIL_PARAM = 'SEIDIL_PARAM',
  JACOBI_PARAM = 'JACOBI_PARAM',
  PRECISION = 'PRECISION'
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'linear-solver';
  stepNumber: number = 1;
  stepID: StepID = StepID.EQUATIONS;
  equations: string = "";
}
