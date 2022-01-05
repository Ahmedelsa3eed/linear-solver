import { Component } from '@angular/core';
import { Gauss } from './methods/Gauss/Gauss';
import { GaussJordan } from './methods/GaussJordan/GaussJordan';
import { Seidil } from './methods/GaussSeidil/Seidil';
import { Jacobi } from './methods/Jacobi/Jacobi';
import { Cholesky } from './methods/LU/Cholesky';
import { Crout } from './methods/LU/Crout';
import { Doolittle } from './methods/LU/Doolittle';
import { LUFactory } from './methods/LU/LUFactory';
import { Matrix } from './shared/Matrix';
import { Status } from './shared/Status.model';
import { Step } from './shared/Step';

enum StepID {
  EQUATIONS = 'EQUATIONS',
  METHOD = 'METHOD',
  LU_PARAM= 'LU_PARAM',
  SEIDIL_PARAM = 'SEIDIL_PARAM',
  JACOBI_PARAM = 'JACOBI_PARAM',
  PRECISION = 'PRECISION',
  SOLUTION = 'SOLUTION',
};

enum MethodID {
  GAUSS = 'GAUSS',
  GAUSS_JORDAN = 'GAUSS_JORDAN',
  LU = 'LU',
  SEIDIL = 'SEIDIL',
  JACOBI = 'JACOBI',
}

enum LuVariant {
  DOWNLITTLE = 'DOWNLITTLE',
  CROUT = 'CROUT',
  CHOLESKY = 'CHOLESKY',
}

enum StoppingCondition {
  NUMBER_ITERATIONS = 'NUMBER_ITERATIONS',
  ABSOLUTE_RELATIVE_ERROR = 'ABSOLUTE_RELATIVE_ERROR',
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'linear-solver';
  stepID: StepID = StepID.EQUATIONS;
  equations: string = "";
  precision: number = 1;
  method: MethodID = MethodID.GAUSS;
  luVariant: LuVariant = LuVariant.DOWNLITTLE;
  initialGuess: string = "";
  stoppingCondition: StoppingCondition = StoppingCondition.NUMBER_ITERATIONS;
  noIterations: number = 1;
  absRelErr: number = 0;
  parsedEquations: Matrix[] = [];
  coefficients: string[] = [];
  MethodIDEnum = MethodID;
  solution: [Step[], Matrix, Status] | null = null;
  katexExplaination: string = "";
  calculationTime: number = 0;
  stringSolution: string = "";
  solvability: Status | undefined = undefined;
  submitEquations(): void {
    this.parseEquations();
    this.stepID = StepID.METHOD;
  }
  submitMethod(method: MethodID): void {
    this.method = method;
    this.stepID = StepID.PRECISION;
  }
  submitPrecision(): void {
    this.parsedEquations[0].changePrecision(this.precision);
    this.parsedEquations[1].changePrecision(this.precision);
    switch(this.method) {
      case MethodID.LU:
        this.stepID = StepID.LU_PARAM;
        break;
      case MethodID.SEIDIL:
        this.stepID = StepID.SEIDIL_PARAM;
        break;
      case MethodID.JACOBI:
        this.stepID = StepID.JACOBI_PARAM;
        break;
      default:
        this.showSolution();
    }
  }
  validateEquations(): Boolean {
    if (this.equations.trim().length === 0) return false;
    const splittedEquations: string[] = this.equations.split('\n').filter(x => x.trim().length > 0);
    const coeff = [...new Set((this.equations.toLowerCase().match(/[a-zA-z]/g) || []))];
    if (coeff.length !== splittedEquations.length) return false;
    for (let equation of splittedEquations) {
      if (!equation.includes("=")) return false;
      if (equation.search(/[a-zA-z]/) === -1) return false;
      if (equation.search(/[a-zA-z]{2,}/) !== -1) return false;
      equation = this.normalizeEquation(equation);
      if (!/([+-]?\d+(?:\.\d+)?[a-z]?)+=[+-]?\d+(?:\.\d+)?/.test(equation)) {
        return false;
      }
    }
    return true;
  }
  normalizeEquation(equation: string): string {
    equation = equation.replace(/\s/g, "");
    equation = equation.toLowerCase();
    equation = equation.replace(/\+\+/g, "+");
    equation = equation.replace(/\-\-/g, "+");
    equation = equation.replace(/\+\-/g, "-");
    equation = equation.replace(/\-\+/g, "-");
    equation = equation.replace(/([-+])([a-z])/g, "$11$2");
    equation = equation.replace(/[*\/]([a-z])/g, "$1");
    equation = equation.replace(/^([a-z])/, "1$1");
    while (equation.search(/([+-]?\d+(?:\.\d+)?)([*\/])([+-]?\d+(?:\.\d+)?)/) !== -1) {
      equation = equation.replace(
        /([+-]?\d+(?:\.\d+)?)([*\/])([+-]?\d+(?:\.\d+)?)/,
        (_: string, p1: string, p2: string, p3: string) => {
          if (p2 === "*") {
            return (parseFloat(p1) * parseFloat(p3)).toString();
          } else {
            return (parseFloat(p1) / parseFloat(p3)).toString();
          }
        }
      );
    }
    if (equation[0] !== "+" && equation[0] !== "-") {
      equation = "+" + equation;
    }
    return equation;
  }
  parseEquations(): void {
    const splittedEquations: string[] = this.equations.split('\n').filter(x => x.trim().length > 0);
    const cols: { [key: string]: number[] } = {};
    const results: number[] = [];
    for (let equation of splittedEquations) {
      const result: { [key: string]: number } = {};
      equation = this.normalizeEquation(equation);
      results.push(parseFloat(equation.split('=')[1]));
      equation = equation.split("=")[0];
      const splittedStr = equation.split(/([+-]?\d+(?:\.\d+)?)([a-zA-z])/).filter(Boolean)
      for (let i = 0; i < splittedStr.length; i += 2) {
        const num = parseFloat(splittedStr[i]);
        const letter = splittedStr[i + 1];
        if (result[letter] !== undefined) {
          result[letter] += num;
        } else {
          result[letter] = num;
        }
      }
      for (const coeff in result) {
        if (cols[coeff] === undefined) {
          cols[coeff] = [result[coeff]];
        } else {
          cols[coeff].push(result[coeff]);
        }
      }
      for (const colKey of Object.keys(cols)) {
        if (!(colKey in result)) {
          cols[colKey].push(0);
        }
      }
    }
    const ordered = Object.keys(cols).sort().reduce(
      (obj: { [key: string]: number[] }, key: string) => { 
        obj[key] = cols[key]; 
        return obj;
      }, 
      {}
    );
    this.coefficients = Object.keys(ordered);
    this.parsedEquations = [
      Matrix.fromArray(Object.values(ordered)).transpose(),
      Matrix.fromArray(results.map(result => [result]))
    ]
    console.log(this.parsedEquations[0].print());
    console.log(this.parsedEquations[1].print());
  };
  validateIterativeParams(): Boolean {
    if (this.initialGuess.search(/[^\d.\s,]/) !== -1) return false;
    const parsedInitialGuess = this.initialGuess
      .replace(/\s/g, "")
      .split(',')
      .map(x => parseFloat(x));
    if (parsedInitialGuess.length !== this.coefficients.length) return false;
    if (parsedInitialGuess.some(x => isNaN(x))) return false;
    return true;
  }
  showSolution(): void {
    const startTime = performance.now();
    switch(this.method) {
      case MethodID.GAUSS:
        this.solution = new Gauss(this.precision).solve(this.parsedEquations[0], this.parsedEquations[1]);
        break;
      case MethodID.GAUSS_JORDAN:
        this.solution = new GaussJordan(this.precision).solve(this.parsedEquations[0], this.parsedEquations[1]);
        break;
      case MethodID.JACOBI:
        var parsedInitialGuess = this.initialGuess
          .replace(/\s/g, "")
          .split(',')
          .map(x => parseFloat(x));
        this.solution = new Jacobi(
          this.parsedEquations[0],
          this.parsedEquations[1],
          parsedInitialGuess,
          this.stoppingCondition === StoppingCondition.ABSOLUTE_RELATIVE_ERROR ? this.absRelErr : undefined,
          this.stoppingCondition === StoppingCondition.NUMBER_ITERATIONS ? this.noIterations : undefined,
          this.precision
        ).solve(
          this.parsedEquations[0],
          this.parsedEquations[1],
          parsedInitialGuess,
          this.coefficients,
          this.stoppingCondition === StoppingCondition.ABSOLUTE_RELATIVE_ERROR ? this.absRelErr : undefined,
          this.stoppingCondition === StoppingCondition.NUMBER_ITERATIONS ? this.noIterations : undefined
        )
        break;
        case MethodID.SEIDIL:
          var parsedInitialGuess = this.initialGuess
            .replace(/\s/g, "")
            .split(',')
            .map(x => parseFloat(x));
          this.solution = new Seidil(
            this.parsedEquations[0],
            this.parsedEquations[1],
            parsedInitialGuess,
            this.stoppingCondition === StoppingCondition.ABSOLUTE_RELATIVE_ERROR ? this.absRelErr : undefined,
            this.stoppingCondition === StoppingCondition.NUMBER_ITERATIONS ? this.noIterations : undefined,
            this.precision
          ).solve(
            this.parsedEquations[0],
            this.parsedEquations[1],
            parsedInitialGuess,
            this.coefficients,
            this.stoppingCondition === StoppingCondition.ABSOLUTE_RELATIVE_ERROR ? this.absRelErr : undefined,
            this.stoppingCondition === StoppingCondition.NUMBER_ITERATIONS ? this.noIterations : undefined
          )
          break;
      case MethodID.LU:
        console.log(this.coefficients)
        if (this.luVariant === LuVariant.DOWNLITTLE) {
          this.solution = new LUFactory(this.precision).getDecomposer("doolittle").solve(this.parsedEquations[0], this.parsedEquations[1], this.coefficients);
        } else if (this.luVariant === LuVariant.CHOLESKY) {
          this.solution = new LUFactory(this.precision).getDecomposer("cholesky").solve(this.parsedEquations[0], this.parsedEquations[1], this.coefficients);
        } else if (this.luVariant === LuVariant.CROUT) {
          this.solution = new LUFactory(this.precision).getDecomposer("crout").solve(this.parsedEquations[0], this.parsedEquations[1], this.coefficients);
        }
        break;
      default:
        break;
    }
    const endTime = performance.now();
    this.calculationTime = endTime - startTime;
    this.katexExplaination = this.solution?.[0].map(x => x.getMsg()).join("$\\newline$") || ""
    this.solvability = this.solution?.[2]
    if (
      this.solution?.[1] !== undefined
    ) {
      this.stringSolution = "";
      for (const [i, coeff] of this.coefficients.entries()) {
        this.stringSolution += `${coeff} = ${this.solution?.[1].getElement(i, 0)}\n`;
      }
    }
    this.stepID = StepID.SOLUTION;
  }
}
