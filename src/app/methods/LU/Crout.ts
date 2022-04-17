import { Step } from "../../shared/Step";
import { Matrix } from "../../shared/Matrix";
import { LU } from "./LU";
import { Big } from "src/app/shared/Big";
import { Status } from "src/app/shared/Status.model";

export class Crout extends LU {
  override solve(X: Matrix, b: Matrix, vars: string[]): [ Step[],Matrix, Status] {
    let stat = Status.FACTORISABLE;
    let steps: Step[] = [];
    let row, col, k: number;
    let sum = 0;
    let n = X.getRows();
    let U: Matrix = new Matrix(X.getRows(), X.getCols());
    let L: Matrix = new Matrix(X.getRows(), X.getCols());
    if (X.getCols() != X.getRows()) {
      stat = Status.NOT_FACTORISABLE;
      return [steps, L, stat];
    }
    let stepStringBuilder = "";
    steps.push(new Step(`$$Ax = b$$`, null))
    steps.push(new Step(`$$${X.printLatex()}x = ${b.printLatex()}$$`, null))
    steps.push(new Step("$\\blacksquare$ Getting Crout form of L & U:", null));
    for (let i = 0; i < U.getRows(); i++) {
      U.setElement(i, i, 1);
    }
    for (col = 0; col < n; col++) {
      steps.push(new Step(`$\\bigstar$ Constructing column ${col + 1} of L:`, null));
      for (row = col; row < n; row++) {
        sum = 0;
        stepStringBuilder = `$$l_{${row + 1}${col + 1}} = a_{${row + 1}${col + 1}} - \\sum_{k=1}^{${col}} l_{${col + 1}k}u_{k${row + 1}} = ${X.getElement(row, col)}`;
        for (k = 0; k < col; k++) {
          sum =
            new Big
            (sum, this.precision)
            .add(
              new Big
              (L.getElement(row, k), this.precision)
              .mul(U.getElement(k, col)).getValue()
            )
            .getValue();
          if (k == 0) {
            stepStringBuilder += " - ("
          }
          stepStringBuilder += `${L.getElement(row, k)} \\times ${U.getElement(k, col)}`;
          if (k == col - 1) {
            stepStringBuilder += ")";
          } else {
            stepStringBuilder += " + ";
          }
        }
        const newValue =
          new Big
          (X.getElement(row, col), this.precision)
          .sub(sum)
          .getValue();
        stepStringBuilder += ` = ${newValue}$$`;
        L.setElement(row, col, newValue);
        stepStringBuilder += `$$${L.printLatex()}$$`
        steps.push(new Step(stepStringBuilder, null));
      }
      steps.push(new Step(`$\\bigstar$ Constructing column ${col + 1} of U:`, null));
      for (row = col; row < n; row++) {
        if (L.getElement(col, col) == 0) {
          stat = Status.NOT_FACTORISABLE;
          return [steps, L, stat];
        }
        sum = 0;
        stepStringBuilder = `$$u_{${col + 1}${row + 1}} = a_{${col + 1}${row + 1}} - \\sum_{k=1}^{${row + 1}} \\frac{l_{${col + 1}k}u_{k${row + 1}}}{l_{${row + 1}${row + 1}}} = \\frac{${X.getElement(col, row)}`;
        for (k = 0; k < col; k++) {
          sum =
            new Big
            (sum, this.precision)
            .add(
              new Big
              (L.getElement(col, k), this.precision)
              .mul(U.getElement(k, row)).getValue()
            )
            .getValue();
          if (k == 0) {
            stepStringBuilder += " - ("
          }
          stepStringBuilder += `${L.getElement(col, k)} \\times ${U.getElement(k, row)}`;
          if (k == col - 1) {
            stepStringBuilder += ")";
          } else {
            stepStringBuilder += " + ";
          }
        }
        const newValue =
          new Big
          (X.getElement(col, row), this.precision)
          .sub(sum)
          .div(L.getElement(col, col))
          .getValue();
        stepStringBuilder += `}{${L.getElement(col, col)}} = ${newValue}$$`;
        U.setElement(col, row, newValue);
        stepStringBuilder += `$$${U.printLatex()}$$`
        steps.push(new Step(stepStringBuilder, null));
      }
    }
    steps.push(new Step(`$\\bigstar$ Finally, we have calculated L & U matrecies.`, null));
    steps.push(new Step("$$L = " + L.printLatex() + "$$", null));
    steps.push(new Step("$$U = " + U.printLatex() + "$$", null));
    let sol = this.Solve(L, U, b, vars, steps);
    return [steps,sol, stat];
  }
}
