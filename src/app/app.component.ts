import { Component } from '@angular/core';
import { Matrix } from './shared/Matrix';

enum StepID {
  EQUATIONS = 'EQUATIONS',
  METHOD = 'METHOD',
  LU_PARAM= 'LU_PARAM',
  SEIDIL_PARAM = 'SEIDIL_PARAM',
  JACOBI_PARAM = 'JACOBI_PARAM',
  PRECISION = 'PRECISION'
};

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
  method: string = "";
  luVariant: LuVariant = LuVariant.DOWNLITTLE;
  initialGuess: string = "";
  stoppingCondition: StoppingCondition = StoppingCondition.NUMBER_ITERATIONS;
  parsedEquations: Matrix[] = [];
  submitEquations(): void {
    this.stepID = StepID.METHOD;
  }
  submitMethod(method: string): void {
    this.method = method;
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
    this.parsedEquations = [
      Matrix.fromArray(Object.values(cols)).transpose(),
      Matrix.fromArray(results.map(result => [result]))
    ]
    console.log(this.parsedEquations[0].print());
    console.log(this.parsedEquations[1].print());
  };
}
