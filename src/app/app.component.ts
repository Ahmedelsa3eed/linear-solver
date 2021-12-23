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
  stepID: StepID = StepID.PRECISION;
  equations: string = "";
  precision: number = 1;
  method: string = "";
  submitEquations(): void {
    this.stepID = StepID.METHOD;
  }
  submitMethod(method: string): void {
    this.method = method;
  }
  parseExpression(str: string): { [key: string]: number } {
    const result: { [key: string]: number } = {};
    str = str.replace(/\s/g, "");
    str = str.replace(/\+\+/g, "+");
    str = str.replace(/\-\-/g, "+");
    str = str.replace(/\+\-/g, "-");
    str = str.replace(/\-\+/g, "-");
    str = str.replace(/\*([a-zA-Z])/g, "$1");
    while (str.includes("*") || str.includes("/")) {
      str = str.replace(
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
    if (str[0] !== "+" && str[0] !== "-") {
      str = "+" + str;
    }
    const splittedStr = str.split(/([+-]?\d+(?:\.\d+)?)([a-zA-z])/).filter(Boolean)
    for (let i = 0; i < splittedStr.length; i += 2) {
      const num = parseFloat(splittedStr[i]);
      const letter = splittedStr[i + 1];
      if (result[letter] !== undefined) {
        result[letter] += num;
      } else {
        result[letter] = num;
      }
    }
    return result;
  };
}
