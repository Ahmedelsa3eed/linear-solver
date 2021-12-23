import { Matrix } from "./Matrix";
import { Step } from "./Step";
import { Substitution } from "./Substitution";

export class LU {
  public Decompose(X: Matrix): [Matrix, Matrix, Step[], any[]?] {
    throw new Error("Implementation missing");
  }
  public static Solve(L: Matrix, U: Matrix, a: Matrix, steps?: Step[], o?: number[]): Matrix | [Matrix, Step[]] {
    let b = a;
    if (o) {
      b = new Matrix(3, 1);
      for (let i = 0; i < o.length; i++) b.setElement(i, 0, a.getElement(o[i], 0));
    }
    let x = Substitution.forward(L, b, "Y");
    if (steps) {
      steps.push(...x[0]);
    }

    let y = Substitution.backward(U, x[1], "X");
    if (steps) {
      steps.push(...y[0]);
      return [y[1], steps];
    }
    return y[1];
  }
}
