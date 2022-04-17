import { Status } from "src/app/shared/Status.model";
import { Matrix } from "../../shared/Matrix";
import { Step } from "../../shared/Step";
import { Substitution } from "./Substitution";

export abstract class LU {
  protected precision: number;
  constructor(precision: number = 6) {
    this.precision = precision;
  }
  abstract solve(U: Matrix, b: Matrix, vars: string[]): [Step[],Matrix, Status];
  protected Solve(
    L: Matrix,
    U: Matrix,
    a: Matrix,
    vars: string[],
    steps?: Step[],
    o?: number[]
  ): Matrix {
    let b = a;
    if (o) {
      b = new Matrix(o.length, 1)
      for (let i = 0; i < o.length; i++) {
        b.setElement(i, 0, a.getElement(o[i], 0));
      }
    }
    steps?.push(new Step("$\\blacksquare$ Solving $LUx = b$ will be done in two steps.", null));
    steps?.push(new Step("$$Ly = b$$", null));
    steps?.push(new Step("$$" + L.printLatex() + "y = " + b.printLatex() + "$$", null));
    steps?.push(new Step("$\\bigstar$ First Step: We want to compute y using forward substitution", null));
    let y = Substitution.forward(L, b, "y", this.precision);
    steps?.push(...y[0]);
    steps?.push(new Step("$$Ux = y$$", null));
    steps?.push(new Step("$$" + U.printLatex() + "x = " + y[1].printLatex() + "$$", null));
    steps?.push(new Step("$\\bigstar$ Last Step: We want to compute x using backward substitution", null));
    let x = Substitution.backward(U, y[1], vars, this.precision);
    steps?.push(...x[0]);
    return x[1];
  }
}
