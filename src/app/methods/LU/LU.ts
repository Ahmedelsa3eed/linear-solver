import { Matrix } from "../../shared/Matrix";
import { Step } from "../../shared/Step";
import { Substitution } from "./Substitution";

export class LU {
  protected precision: number;
  constructor(precision: number = 6) {
    this.precision = precision;
  }
  public Decompose(X: Matrix): [Matrix, Matrix, Step[], string, any[]?] {
    throw new Error("Implementation missing");
  }
  public Solve(
    L: Matrix,
    U: Matrix,
    a: Matrix,
    steps?: Step[],
    o?: number[]
  ): Matrix | [Matrix, Step[]] {
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

    let y = Substitution.backward(U, x[1], "X", this.precision);
    if (steps) {
      steps.push(...y[0]);
      return [y[1], steps];
    }
    return y[1];
  }
}
