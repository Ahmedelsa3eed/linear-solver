import { Step } from "../../shared/Step";
import { Matrix } from "../../shared/Matrix";
import { LU } from "./LU";
import { Big } from "src/app/shared/Big";
import { Status } from "src/app/shared/Status.model";

export class Crout extends LU {
  override solve(X: Matrix,b:Matrix,vars:string[]): [ Step[],Matrix, Status] {
    let stat = Status.FACTORISABLE;
    let steps: Step[] = [];
    let row, col, k: number;
    let sum = 0;
    let n = X.getRows();
    let U: Matrix = new Matrix(X.getRows(), X.getCols());
    let L: Matrix = new Matrix(X.getRows(), X.getCols());
    if (X.getCols() != X.getRows()) {
      stat = Status.NOT_FACTORISABLE;
      return [ steps,L, stat];
    }
    steps.push(new Step("Applying LU-Crout decomposition", null));
    for (let i = 0; i < U.getRows(); i++) {
      U.setElement(i, i, 1);
    }
    steps.push(new Step("Constructing L :", null));
    for (col = 0; col < n; col++) {
      for (row = col; row < n; row++) {
        sum = 0;
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
        }
        const newValue =
          new Big
          (X.getElement(row, col), this.precision)
          .sub(sum)
          .getValue();
        L.setElement(row, col, newValue);
        steps.push(new Step("$L_{" + col + "" + row + "} = " + X.getElement(row, col) + " - " + sum + " = " + L.getElement(row, col) + "$", L));
      }
      for (row = col; row < n; row++) {
        if (L.getElement(col, col) == 0) {
          stat = Status.NOT_FACTORISABLE;
          return [steps,L, stat];
        }
        sum = 0;
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
        }
        const newValue =
          new Big
          (X.getElement(col, row), this.precision)
          .sub(sum)
          .div(L.getElement(col, col))
          .getValue();
        U.setElement(col, row, newValue);
        steps.push(new Step("$L_{" + col + "" + row + "} = "+" \\frac{"+X.getElement(col, row) + " - " + sum +"}{"+L.getElement(col, col)+"}"+" = " + L.getElement(col,row) + "$", L));
      }
    }
    steps.push(new Step("L :", L));
    steps.push(new Step("U :", U));
    let sol=this.Solve(L,U,b,vars,steps);
    return [steps,sol, stat];
  }
}
