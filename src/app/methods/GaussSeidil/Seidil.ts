import { Big } from "src/app/shared/Big";
import { Status } from "src/app/shared/Status.model";
import { Matrix } from "../../shared/Matrix";
import { Step } from "../../shared/Step";

export class Seidil {
  private n!: number;
  private precision: number;

  constructor(precision: number = 6) {//default SFs is 6
    this.precision = precision;
  }

  solve(
    A: Matrix,
    B: Matrix,
    initialGuess: number[],
    vars: string[],
    es: number = 0.00001,       //default relative error is 0.00001
    imax: number = 50           //default iterations is 50
  ): [Step[], Matrix, Status] {
    let steps = this.showTheFormula(vars);
    this.n = A.getRows()
    const x: number[][] = [];
    const ea = [];
    const guess = initialGuess;
    let stepStringBuilder = "";
    const Aclone = A.clone();
    const Bclone = B.clone();
    try {
      this.rearrange(A, B)
    } catch (e: any) {
      steps.push(new Step(`$$Ax = b$$`, null))
      steps.push(new Step(`$$${Aclone.printLatex()}x = ${Bclone.printLatex()}$$`, null))
      steps.push(new Step("$\\blacksquare$ A matrix has zeros in diagonal even after partial pivoting.", null))
      steps.push(new Step("$\\blacksquare$ The matrix isn't solvable by Jacobi iterative method.", null))
      return ([steps, A, Status.ZERO_DIAGONAL]);
    }
    steps.push(new Step(`$$Ax = b$$`, null))
    steps.push(new Step(`$$${A.printLatex()}x = ${B.printLatex()}$$`, null))
    steps.push(new Step("$\\blacksquare$ Applying Seidil iterative method:", null))
    for (let k = 0; k < imax; k++) {
      x[k] = [];
      steps.push(new Step("$\\bigstar$ Iteration #" + (k + 1) + ":", null));
      for (let i = 0; i < this.n; i++) {
        x[k][i] = B.getElement(i, 0);
        stepStringBuilder = `$$${vars[i]}^${k + 1} = \\frac{${x[k][i]}`;
        for (let j = 0; j < this.n; j++) {
          if (j == 0) {
            stepStringBuilder += " - (";
          }
          if (i != j) {
            x[k][i] =
              new Big
              (x[k][i], this.precision)
              .sub(
                new Big
                (A.getElement(i, j), this.precision)
                .mul(guess[j])
              )
              .getValue()
            stepStringBuilder += `${A.getElement(i, j)} \\times ${guess[j]}`;
          }
          if (j == this.n - 1) {
            stepStringBuilder += ")";
          } else {
            stepStringBuilder += " + ";
          }
        }
        x[k][i] =
          new Big
          (x[k][i], this.precision)
          .div(A.getElement(i, i))
          .getValue()
        stepStringBuilder += `}{${A.getElement(i, i)}} = ${x[k][i]}$$`;
        steps.push(new Step(stepStringBuilder, null));
        ea[i] =
          new Big
          (x[k][i], this.precision)
          .sub(guess[i])
          .div(x[k][i])
          .abs()
          .getValue()
        guess[i] = x[k][i];
        steps.push(new Step(`$$|\\epsilon_a|_${vars[i]} = |\\frac{${vars[i]}^${k + 1} - ${vars[i]}^${k}}{${vars[i]}^${k + 1}}| = |\\frac{${x[k][i]} - ${guess[i]}}{${x[k][i]}}| = ${ea[i]}$$`, null));
      }

      let max = ea[0];
      for (let i = 1; i < ea.length; i++) if (ea[i] > max) max = ea[i];

      if (max === 0 || max < es || k >= 50) break;
    }
    let res = new Matrix(this.n,this.n)
    for (let index = 0; index < guess.length; index++) {
       res.setElement(index, 0, guess[index]);
    }
    return [steps, res, Status.UNIQUE];
  }

  private showTheFormula(vars: string[]): Step[] {
    const equations: Step[] = [];
    for (let i = 0; i < this.n; i++) {
      let stepStringBuilder = `$$${vars[i]}^{new} = \\frac{b_${vars[i]}`;
      for (let j = 0; j < this.n; j++) {
        if (i != j) stepStringBuilder += ` - a_{${i + 1}${j + 1}} \\times ${vars[j]}^{new}`;
      }
      stepStringBuilder += `}{a_{${i + 1}${i + 1}}}$$`;
      equations[i] = new Step(stepStringBuilder, null);
    }
    return equations;
  }

  /**
   * the equations are rearranged so that
   * in the ith equation the coefficient of xi is nonzero
   */
    private rearrange(A: Matrix, B: Matrix): void {
    for (let i = 0; i < this.n; i++) {
      if (A.getElement(i, i) == 0) {
        let flag = false
        for (let j = 0; j < this.n; j++) {
          if (i != j && A.getElement(j, i) != 0 && A.getElement(i, j) != 0){
            flag = true
            A.exchangeRows(i, j)
            B.exchangeRows(i, j)
          }
        }
        if (flag == false) {
          throw new Error("The matrix isn't solvable by jacobi");
        }
      }
    }
  }
}
