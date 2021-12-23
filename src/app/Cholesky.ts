import { Step } from "./Step";
import { Matrix } from "./Matrix";
import { LU } from "./LU";

export class Cholesky extends LU {
  override Decompose(X: Matrix): [Matrix, Matrix, Step[]] {
    let n: number = X.getRows();
    let U: Matrix = new Matrix(X.getRows(), X.getCols());
    let L: Matrix = new Matrix(X.getRows(), X.getCols());
    if (!X.isPosDef()) {
      throw new Error("The matrix is not a positive definite");
    }
    let steps: Step[] = [];
    let sum: number;
    steps.push(new Step("Applying LU-Cholesky decomposition", null));
    steps.push(new Step("Constructing L :", null));
    for (let row = 0; row < n; row++) {
      for (let col = 0; col <= row; col++) {
        sum = 0;
        for (let k = 0; k < col; k++) {
          sum += L.getElement(col, k) * L.getElement(row, k);
        }
        if (col == row) {
          L.setElement(row, col, Math.sqrt(X.getElement(col, col) - sum));
          steps.push(new Step("L[" + row + "][" + col + "] = √(" + X.getElement(col, col) + " - " + sum + ")" + " = " + L.getElement(row, col), null));
        } else {
          L.setElement(row, col, (X.getElement(row, col) - sum) / L.getElement(col, col));
          steps.push(new Step("L[" + row + "][" + col + "] = (" + X.getElement(row, col) + " - " + sum + ")/" + L.getElement(col, col) + " = " + L.getElement(row, col), null));
        }
      }
    }
    steps.push(new Step("L :", L));
    U = L.transpose();
    steps.push(new Step("Constructing U where U is the transpose of L", U));
    return [L, U, steps];
  }
}
