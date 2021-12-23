import { Step } from "../../shared/Step";
import { Matrix } from "../../shared/Matrix";
import { LU } from "./LU";
import { Big } from "src/app/shared/Big";
import { Status } from "src/app/shared/Status.model";

export class Cholesky extends LU {
  override solve(X: Matrix,b:Matrix,vars:string[]): [Step[], Matrix, Status] {
    let stat = Status.FACTORISABLE;
    let n: number = X.getRows();
    let U: Matrix = new Matrix(X.getRows(), X.getCols());
    let L: Matrix = new Matrix(X.getRows(), X.getCols());
    let steps: Step[] = [];
    let sum: number;
    if (!X.isPosDef()) {
      stat = Status.NOT_POSITIVE_DEF;
      return [steps,L, stat];
    }
    steps.push(new Step("Applying LU-Cholesky decomposition", null));
    steps.push(new Step("Constructing L :", null));
    for (let row = 0; row < n; row++) {
      for (let col = 0; col <= row; col++) {
        sum = 0;
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
        }
        if (col == row) {
          const newValue =
            new Big
            (X.getElement(row, col), this.precision)
            .sub(sum)
            .sqrt()
            .getValue();
          L.setElement(row, col, newValue);
          steps.push(new Step("$L_{" + row + "" + col + "} = √(" + X.getElement(col, col) + " - " + sum + ")" + " = " + L.getElement(row, col) + "$", L));
        } else {
          const newValue =
            new Big
            (X.getElement(row, col), this.precision)
            .sub(sum)
            .div(L.getElement(col, col))
            .getValue();
          L.setElement(row, col, newValue);
          steps.push(new Step("$L_{" + row + "" + col + "} = "+" \\frac{"+X.getElement(row, col) + " - " + sum +"}{"+L.getElement(col, col)+"}"+" = " + L.getElement(row, col) + "$", L));
        }
      }
    }
    steps.push(new Step("L :", L));
    U = L.transpose();
    steps.push(new Step("$\\newline$Constructing U where U is the transpose of L", U));
    let sol=this.Solve(L,U,b,vars,steps);
    return [steps,sol, stat];
  }
}
