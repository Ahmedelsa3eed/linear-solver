import { Component } from '@angular/core';
import functionPlot from 'function-plot';
import * as math from 'mathjs';
import { Bisection } from './methods/Bisection/Bisection';
import { FixedPoint } from './methods/FixedPoint/FixedPoint';
import { NewtonRaphson } from './methods/Newton/NewtonRaphson';
import { RegulaFalsi } from './methods/Regula-Falsi/RegulaFalsi';
import { Seacant } from './methods/Seacants/Seacant';
import { Status } from './shared/Status.model';

enum StepID {
  EQUATIONS = 'EQUATIONS',
  METHOD = 'METHOD',
  METHOD_PARAM = 'METHOD_PARAM',
  PRECISION = 'PRECISION',
  SOLUTION = 'SOLUTION',
};

enum MethodID {
  BISECTION = 'BISECTION',
  FALSE_POSITIVE = 'FALSE_POSITIVE',
  FIXED_POINT = 'FIXED_POINT',
  NEWTON_RAPHSON = 'NEWTON_RAPHSON',
  SECANT = 'SECANT',
}

enum StoppingCondition {
  NUMBER_ITERATIONS = 'NUMBER_ITERATIONS',
  ABSOLUTE_RELATIVE_ERROR = 'ABSOLUTE_RELATIVE_ERROR',
}

@Component({
  selector: 'app-nonlinear',
  templateUrl: './nonlinear.component.html',
  styleUrls: ['./nonlinear.component.scss']
})
export class NonLinearComponent {
  title = 'linear-solver';
  stepID: StepID = StepID.EQUATIONS;
  equation: string = "";
  precision: number = 1;
  method: MethodID = MethodID.BISECTION;
  initialGuess1: number = 1;
  initialGuess2: number = 1;
  stoppingCondition: StoppingCondition = StoppingCondition.NUMBER_ITERATIONS;
  noIterations: number = 1;
  absRelErr: number = 0.00001;
  MethodIDEnum = MethodID;
  solution: [string[], number, Status, any[], any[]] | null = null;
  katexExplaination: string = "";
  calculationTime: number = 0;
  stringSolution: string = "";
  solvability: Status | undefined = undefined;
  submitEquation(): void {
    this.stepID = StepID.METHOD;
  }
  submitMethod(method: MethodID): void {
    this.method = method;
    this.stepID = StepID.PRECISION;
  }
  submitPrecision(): void {
    this.stepID = StepID.METHOD_PARAM;
  }
  validateEquation(): Boolean {
    try {
      if (!math.evaluate("f(x)=" + this.equation)) return false;
    } catch (e) {
      return false;
    }
    return true;
  }
  validateIterativeParams(): Boolean {
    return true;
  }
  showSolution(): void {
    const startTime = performance.now();
    switch(this.method) {
      case MethodID.BISECTION:
        this.solution = new Bisection(this.precision).solve(
          this.equation,
          this.initialGuess1,
          this.initialGuess2,
          this.stoppingCondition === StoppingCondition.NUMBER_ITERATIONS ? this.noIterations : undefined,
          this.stoppingCondition === StoppingCondition.ABSOLUTE_RELATIVE_ERROR ? this.absRelErr : undefined
        );
        break;
      case MethodID.FALSE_POSITIVE:
        this.solution = new RegulaFalsi(this.precision).solve(
          this.equation,
          this.initialGuess1,
          this.initialGuess2,
          this.stoppingCondition === StoppingCondition.NUMBER_ITERATIONS ? this.noIterations : undefined,
          this.stoppingCondition === StoppingCondition.ABSOLUTE_RELATIVE_ERROR ? this.absRelErr : undefined
        );
        break;
      case MethodID.FIXED_POINT:
        this.solution = new FixedPoint(this.precision).solve(
          this.equation,
          this.initialGuess1,
          this.stoppingCondition === StoppingCondition.NUMBER_ITERATIONS ? this.noIterations : undefined,
          this.stoppingCondition === StoppingCondition.ABSOLUTE_RELATIVE_ERROR ? this.absRelErr : undefined
        );
        break;
      case MethodID.NEWTON_RAPHSON:
        this.solution = new NewtonRaphson(this.precision).solve(
          this.equation,
          this.initialGuess1,
          this.stoppingCondition === StoppingCondition.NUMBER_ITERATIONS ? this.noIterations : undefined,
          this.stoppingCondition === StoppingCondition.ABSOLUTE_RELATIVE_ERROR ? this.absRelErr : undefined
        );
        break;
      case MethodID.SECANT:
        this.solution = new Seacant(this.precision).solve(
          this.equation,
          this.initialGuess1,
          this.initialGuess2,
          this.stoppingCondition === StoppingCondition.NUMBER_ITERATIONS ? this.noIterations : undefined,
          this.stoppingCondition === StoppingCondition.ABSOLUTE_RELATIVE_ERROR ? this.absRelErr : undefined
        );
        break;
      default:
        break;
    }
    const endTime = performance.now();
    this.calculationTime = +(endTime - startTime).toPrecision(3);
    this.katexExplaination = this.solution?.[0].join("$\\newline$") || ""
    this.solvability = this.solution?.[2]
    if (
      this.solution?.[2] === Status.FACTORISABLE ||
      this.solution?.[2] === Status.UNIQUE ||
      this.solution?.[2] === Status.CONVERGED ||
      this.solution?.[2] === Status.MAX
    ) {
      this.stringSolution = this.solution?.[1].toString();
      functionPlot({
        target: "#graph",
        width: 600,
        height: 300,
        yAxis: { domain: [-10, 10] },
        grid: true,
        data: this.solution?.[3],
        annotations: this.solution?.[4]
      });
    } else if (this.solution?.[2] === Status.DIVERGED) {
      functionPlot({
        target: "#graph",
        width: 600,
        height: 300,
        yAxis: { domain: [-10, 10] },
        grid: true,
        data: this.solution?.[3],
        annotations: this.solution?.[4]
      });
    }
    this.stepID = StepID.SOLUTION;
  }
}
