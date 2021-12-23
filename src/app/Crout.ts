import { Step } from "./Step";
import { Matrix } from "./Matrix";
import { LU } from "./LU";

export class Crout extends LU {
  override Decompose(X: Matrix): [Matrix, Matrix, Step[]] {
    let steps: Step[] = [];
    let row, col, k: number;
    let sum = 0;
    let n = X.getRows();
    let U: Matrix = new Matrix(X.getRows(), X.getCols());
    let L: Matrix = new Matrix(X.getRows(), X.getCols());

    steps.push(new Step("Applying LU-Crout decomposition", null));
    for (let i = 0; i < U.getRows(); i++) {
      U.setElement(i, i, 1);
    }
    steps.push(new Step("Constructing L :", null));
    for (col = 0; col < n; col++) {
      for (row = col; row < n; row++) {
        sum = 0;
        for (k = 0; k < col; k++) {
          sum = sum + L.getElement(row, k) * U.getElement(k, col);
        }
        L.setElement(row, col, X.getElement(row, col) - sum);
        steps.push(new Step("L[" + col + "][" + row + "] = " + X.getElement(row, col) + " - " + sum + " = " + L.getElement(row, col), null));
      }
      for (row = col; row < n; row++) {
        if (L.getElement(col, col) == 0) {
          throw new Error("Matrix can't be decomposed");
        }
        sum = 0;
        for (k = 0; k < col; k++) {
          sum = sum + L.getElement(col, k) * U.getElement(k, row);
        }
        U.setElement(col, row, (X.getElement(col, row) - sum) / L.getElement(col, col));
        steps.push(new Step("U[" + col + "][" + row + "] = (" + X.getElement(col, row) + " - " + sum + ")/" + L.getElement(col, col) + " = " + U.getElement(col, row), null));
      }
    }
    steps.push(new Step("L :", L));
    steps.push(new Step("U :", U));
    return [L, U, steps];
  }
}
