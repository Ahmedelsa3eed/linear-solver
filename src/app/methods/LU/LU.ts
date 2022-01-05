import { Status } from "src/app/shared/Status.model";
import { Matrix } from "../../shared/Matrix";
import { Step } from "../../shared/Step";
import { Substitution } from "./Substitution";

export class LU {
  protected precision: number;
  constructor(precision: number = 6) {
    this.precision = precision;
  }
  public solve(X: Matrix,B:Matrix,vars:string[]): [Step[], Matrix, Status] {
    throw new Error("Implementation missing");
  }
  public Solve(
    L: Matrix,
    U: Matrix,
    a: Matrix,vars:string[],
    steps?: Step[],
    o?: number[]
  ): Matrix {
    let b = a;
    if (o) {
      b = new Matrix(3, 1);
      for (let i = 0; i < o.length; i++) {
        b.setElement(i, 0, a.getElement(o[i], 0));
      }
    }
    let x = Substitution.forward(L, b, "Y", this.precision);
    if (steps) {
      steps.push(...x[0]);
    }

    let y = Substitution.backward(U, x[1], vars, this.precision);
    if (steps) {
      steps.push(...y[0]);
    }
    return y[1];
  }
}
