import { LU } from "./LU";
import { Matrix } from "../../shared/Matrix";
import { Step } from "../../shared/Step";
import { Big } from "src/app/shared/Big";
import { Status } from "src/app/shared/Status.model";

export class Doolittle extends LU {
  private static partialPivotIn(U: Matrix, currentRow: number): number {
    let indexOfMaxPivot = currentRow;
    for (let i = currentRow + 1; i < U.getRows(); i++) {
      if (Math.abs(U.getElement(i, currentRow)) > Math.abs(U.getElement(indexOfMaxPivot, currentRow))) {
        indexOfMaxPivot = i;
      }
    }
    return indexOfMaxPivot;
  }

  public override solve(U: Matrix, b: Matrix, vars: string[]): [Step[],Matrix, Status] {
    let stat = Status.FACTORISABLE;
    let o = [];
    for (let i = 0; i < U.getRows(); i++) o[i] = i;
    let steps: Step[] = [];
    let L: Matrix = new Matrix(U.getRows(), U.getCols());

    if (U.getCols() != U.getRows()) {
      stat = Status.NOT_FACTORISABLE;
      return [steps,L, stat];
    }
    
    steps.push(new Step(`$$Ax = b$$`, null))
    steps.push(new Step(`$$${U.printLatex()}x = ${b.printLatex()}$$`, null))
    steps.push(new Step("$\\blacksquare$ Getting Doolittle form of L & U using Gauss elimination:", null));
    for (let i = 0; i < U.getRows() - 1; i++) {
      let fix = Doolittle.partialPivotIn(U, i);
      if (fix == 0) {
        stat = Status.NOT_FACTORISABLE;
        return [steps,L, stat];
      }
      if (fix != i) {
        let temp: number = o[fix];
        o[fix] = o[i];
        o[i] = temp;
        U.exchangeRows(i, fix);
        L.exchangeRows(i, fix);
        steps.push(new Step(`$\\bigstar$ Applying Partial Pivoting:`, null));
        steps.push(new Step(`$$R_${fix + 1} \\Leftrightarrow R_${i + 1}$$`, null));
        steps.push(new Step(`$$${U.printLatex()}$$`, null));
      }

      for (let row = i + 1; row < U.getRows(); row++) {
        const factorNumerator = U.getElement(row, i);
        const factorDenominator = U.getElement(i, i);
        const factor =
          new Big
          (factorNumerator, this.precision)
          .div(factorDenominator)
          .getValue();
        L.setElement(row, i, factor);
        steps.push(new Step(
          (
            `$\\bigstar$ Divide row ${i + 1} by ${factorDenominator} ` +
            `and multiply it by ${factorNumerator}, ` + 
            `subtract the result from row ${row + 1} then ` +
            `substitute new row for row ${row + 1}:`
          ),
          null
        ));
        for (let col = 0; col < U.getCols(); col++) {
          const newValue =
            new Big
            (U.getElement(row, col), this.precision)
            .sub(
              new Big
              (factor, this.precision)
              .mul(U.getElement(i, col))
            )
            .getValue();
          U.setElement(row, col, newValue);
        }
        steps.push(new Step(`$$l_{${row + 1}${i + 1}} = \\frac{${factorNumerator}}{${factorDenominator}} = ${factor}$$`, null));
        steps.push(new Step(
          (
            "$$R_" +
            (row + 1) +
            " \\Leftarrow " + 
            (-factor) +
            " \\times " +
            "R_" +
            (i + 1) +
            " + " +
            "R_" +
            (row + 1) +
            "$$" +
            "$$" +
            U.printLatex() +
            "$$"
          ),
          null
        ));
      }
    }
    for (let i = 0; i < U.getRows(); i++) L.setElement(i, i, 1); // Initialize the main diagonal
    steps.push(new Step(`$\\bigstar$ Finally, we have calculated L & U matrecies.`, null));
    steps.push(new Step("$$L = " + L.printLatex() + "$$", null));
    steps.push(new Step("$$U = " + U.printLatex() + "$$", null));
    if (U.getElement(U.getRows() - 1, U.getCols() - 1) == 0) {
      steps.push(new Step("$\\because$ Number of pivots of U matrix is less than number of unknowns.", null));
      steps.push(new Step("$\\therefore$ System of equations has infinite number of solutions.", null));
      stat = Status.INFINITE;
    }
    let sol = this.Solve(L, U, b, vars, steps, o)
    return [steps, sol, stat];
  }
}
