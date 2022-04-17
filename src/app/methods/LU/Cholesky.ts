import { Step } from "../../shared/Step";
import { Matrix } from "../../shared/Matrix";
import { LU } from "./LU";
import { Big } from "src/app/shared/Big";
import { Status } from "src/app/shared/Status.model";

export class Cholesky extends LU {
  override solve(X: Matrix, b: Matrix, vars: string[]): [Step[], Matrix, Status] {
    let stat = Status.FACTORISABLE;
    let n: number = X.getRows();
    let U: Matrix = new Matrix(X.getRows(), X.getCols());
    let L: Matrix = new Matrix(X.getRows(), X.getCols());
    let steps: Step[] = [];
    let sum: number;
    let stepStringBuilder = "";
    steps.push(new Step(`$$Ax = b$$`, null))
    steps.push(new Step(`$$${X.printLatex()}x = ${b.printLatex()}$$`, null))
    steps.push(new Step("$\\blacksquare$ Getting Cholesky form of L & U:", null));
    steps.push(new Step("$\\bigstar$ Calculating elements of L matrix:", null));
    for (let row = 0; row < n; row++) {
      for (let col = 0; col <= row; col++) {
        sum = 0;
        stepStringBuilder = col == row ?
          `$$l_{${row + 1}${col + 1}} = \\sqrt{a_{${row + 1}${row + 1}} - \\sum_{k=1}^{${col}} l_{${row + 1}k}^2} = \\sqrt{${X.getElement(row, col)}` :
          `$$l_{${row + 1}${col + 1}} = \\frac{a_{${row + 1}${col + 1}} - \\sum_{k=1}^{${col}} l_{${row + 1}k}l_{${col + 1}k}}{l_{${col + 1}${col + 1}}} = \\frac{${X.getElement(row, col)}`;
        for (let k = 0; k < col; k++) {
          sum =
            new Big
            (sum, this.precision)
            .add(
              new Big
              (L.getElement(col, k), this.precision)
              .mul(L.getElement(row, k)).getValue()
            )
            .getValue()
          if (k == 0) {
            stepStringBuilder += " - ("
          }
          stepStringBuilder += `${L.getElement(col, k)} \\times ${L.getElement(row, k)}`;
          if (k == col - 1) {
            stepStringBuilder += ")";
          } else {
            stepStringBuilder += " + ";
          }
        }
        if (col == row) {
          const sqrtContent =
            new Big
            (X.getElement(row, col), this.precision)
            .sub(sum)
            .getValue()
          const newValue =
            new Big
            (sqrtContent, this.precision)
            .sqrt()
            .getValue();
          stepStringBuilder += `} = ${newValue || "Complex"}$$`;
          L.setElement(row, col, newValue);
          steps.push(new Step(stepStringBuilder, null));
          if (sqrtContent <= 0) {
            if (sqrtContent < 0) {
              steps.push(new Step(`$\\because l_{${row + 1}${col + 1}}$ is a complex number.`, null));
            } else {
              steps.push(new Step(`$\\because l_{${row + 1}${col + 1}}$ equals zero.`, null));
            }
            steps.push(new Step("$\\therefore$ A is not symmetric positive definite matrix.", null));
            stat = Status.NOT_SYMMETRIC_POSITIVE_DEF;
            return [steps, L, stat];
          } else {
            steps.push(new Step("$$" + L.printLatex() + "$$", null));
          }
        } else {
          const newValue =
            new Big
            (X.getElement(row, col), this.precision)
            .sub(sum)
            .div(L.getElement(col, col))
            .getValue();
          stepStringBuilder += `}{${L.getElement(col, col)}} = ${newValue}$$`;
          L.setElement(row, col, newValue);
          steps.push(new Step(stepStringBuilder, null));
        }
      }
    }
    steps.push(new Step("$\\bigstar$ Constructing L matrix from the calculated elements:", null));
    steps.push(new Step("$$L = " + L.printLatex() + "$$", null));
    U = L.transpose();
    steps.push(new Step("$\\bigstar$ Constructing U where U is the transpose of L", null));
    steps.push(new Step(`$$L^T = ${U.printLatex()}$$`, null));
    steps.push(new Step(`$\\bigstar$ Finally, we have calculated L & U matrecies.`, null));
    steps.push(new Step("$$L = " + L.printLatex() + "$$", null));
    steps.push(new Step("$$U = " + U.printLatex() + "$$", null));
    let sol=this.Solve(L, U, b, vars, steps);
    return [steps,sol, stat];
  }
}
