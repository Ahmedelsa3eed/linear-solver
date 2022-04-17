import { Gauss } from "../Gauss/Gauss";
import { Matrix } from "../../shared/Matrix";
import { Step } from "../../shared/Step";
import { Big } from "src/app/shared/Big";
import { Status } from "src/app/shared/Status.model";

export class GaussJordan extends Gauss {
  private dividByPivotElement(
    Row: number,
    fromCol: number,
    matrix: Matrix,
    b: Matrix
  ) {
    const pivot: number = matrix.getElement(Row, fromCol);
    for (let i = fromCol; i < matrix.getCols(); i++) {
      const newValue =
        new Big
        (matrix.getElement(Row, i), this.precision)
        .div(pivot)
        .getValue()
      matrix.setElement(Row, i, newValue);
    }
    const newValue =
      new Big
      (b.getElement(Row, 0), this.precision)
      .div(pivot)
      .getValue()
    b.setElement(Row, 0, newValue);
  }

  private gaussJordan(matrix: Matrix, b: Matrix): [Step[], Status] {
    const gaussRes = this.gauss(matrix, b)
    let steps = gaussRes[0];
    let stat = gaussRes[1];
    if (stat === Status.INFINITE || stat === Status.NO_SOLUTION) {
      return [steps, stat];
    }
    steps.push(new Step("$\\blacksquare$ Applying backward elimination:", null))
    for (let i = matrix.getRows() - 1; i >= 0; i--) {
      steps.push(new Step(`$\\bigstar$ Divide row ${i + 1} by ${matrix.getElement(i, i)}:`, null))
      steps.push(new Step(
        (
          "$$R_" +
          (i + 1) +
          " \\Leftarrow " +
          "1 /" +
          matrix.getElement(i, i) +
          " \\times " +
          "R_" +
          (i + 1) +
          "$$" +
          "$$" +
          matrix.printAugmented(b) +
          "$$"
        ),
        null
      ));
      this.dividByPivotElement(i, i, matrix, b);
      for (let j = i - 1; j >= 0; j--) {
        const factorNumerator = matrix.getElement(j, i);
        const factorDenominator = matrix.getElement(i, i);
        const factor =
          new Big
          (factorNumerator, this.precision)
          .div(factorDenominator)
          .getValue();
          steps.push(new Step(
            (
              `$\\bigstar$ Divide row ${i + 1} by ${factorDenominator} ` +
              `and multiply it by ${factorNumerator}, ` + 
              `subtract the result from row ${j + 1} then ` +
              `substitute new row for row ${j + 1}:`
            ),
            null
          ));
        for (let k = matrix.getCols() - 1; k > j; k--) {
          const newValue =
            new Big
            (matrix.getElement(j, k), this.precision)
            .sub(
              new Big
              (factor, this.precision)
              .mul(matrix.getElement(i, k))
            )
            .getValue();
          matrix.setElement(j, k, newValue);
        }
        const newValue =
          new Big
          (b.getElement(j, 0), this.precision)
          .sub(
            new Big
            (factor, this.precision)
            .mul(b.getElement(i, 0))
          )
          .getValue();
        b.setElement(j, 0, newValue);
        steps.push(new Step(
          (
            "$$R_" +
            (j + 1) +
            " \\Leftarrow " +
            (-factor) +
            " \\times " +
            "R_" +
            (i + 1) +
            " + " +
            "R_" +
            (j + 1) +
            "$$" +
            "$$" +
            matrix.printAugmented(b) +
            "$$"
          ),
          null
        ));
      }
    }
    return [steps, stat];
  }

  override solve(matrix: Matrix, b: Matrix): [Step[], Matrix, Status] {
    const gaussRes = this.gaussJordan(matrix, b);
    let steps = gaussRes[0];
    let stat = gaussRes[1];
    if (stat === Status.UNIQUE) {
      steps.push(new Step("$\\blacksquare$ The Solution is:$$" + b.printLatex() + "$$", null));
    }
    return [steps, b, stat];
  }
}
