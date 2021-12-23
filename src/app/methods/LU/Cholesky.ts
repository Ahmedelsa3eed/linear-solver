import { Step } from "../../shared/Step";
import { Matrix } from "../../shared/Matrix";
import { LU } from "./LU";
import { Big } from "src/app/shared/Big";

export class Cholesky extends LU {
  override Decompose(X: Matrix): [Matrix, Matrix, Step[], string] {
    let stat = "FACTORISABLE";
    let n: number = X.getRows();
    let U: Matrix = new Matrix(X.getRows(), X.getCols());
    let L: Matrix = new Matrix(X.getRows(), X.getCols());
    let steps: Step[] = [];
    let sum: number;
    if (!X.isPosDef()) {
      stat = "NOT_POSITIVE_DEF";
      return [L, U, steps, stat];
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
              .mul(L.getElement(row, k))
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
          steps.push(new Step("L[" + row + "][" + col + "] = √(" + X.getElement(col, col) + " - " + sum + ")" + " = " + L.getElement(row, col), null));
        } else {
          const newValue =
            new Big
            (X.getElement(row, col), this.precision)
            .sub(sum)
            .div(L.getElement(col, col))
            .getValue();
          L.setElement(row, col, newValue);
          steps.push(new Step("L[" + row + "][" + col + "] = (" + X.getElement(row, col) + " - " + sum + ")/" + L.getElement(col, col) + " = " + L.getElement(row, col), null));
        }
      }
    }
    steps.push(new Step("L :", L));
    U = L.transpose();
    steps.push(new Step("Constructing U where U is the transpose of L", U));
    return [L, U, steps, stat];
  }
}
