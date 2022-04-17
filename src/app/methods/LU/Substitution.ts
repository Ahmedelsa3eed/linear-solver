import { Big } from "src/app/shared/Big";
import { Matrix } from "../../shared/Matrix";
import { Step } from "../../shared/Step";

export class Substitution {
  static forward(
    matrix: Matrix,
    b: Matrix,
    variable: string,
    precision: number
  ): [Step[], Matrix] {
    let steps: Step[] = [];
    let solution: Matrix = new Matrix(matrix.getRows(), 1);
    let stepStringBuilder = "";
    steps.push(new Step("$\\blacksquare$ Applying forward substitution:", null));
    for (let row = 0; row < matrix.getRows(); row++) {
      let sum = b.getElement(row, 0);
      stepStringBuilder = `$$${variable}_${row + 1} = \\frac{${b.getElement(row, 0)}`;
      for (let col = 0; col < row; col++) {
        sum =
          new Big
          (sum, precision)
          .sub(
            new Big
            (matrix.getElement(row, col), precision)
            .mul(solution.getElement(col, 0))
          )
          .getValue();
        stepStringBuilder += ` - ${matrix.getElement(row, col)} \\times ${solution.getElement(col, 0)}`;
      }
      const newValue =
        new Big
        (sum, precision)
        .div(matrix.getElement(row, row))
        .getValue();
      solution.setElement(row, 0, newValue);
      stepStringBuilder += `}{${matrix.getElement(row, row)}} = ${newValue}$$`;
      steps.push(new Step(stepStringBuilder, null));
    }
    steps.push(new Step(`$\\bigstar$ Finally, matrix $y$ has been calculated too:`, null));
    steps.push(new Step("$$" + variable + " = " + solution.printLatex() + "$$", null));
    return [steps, solution];
  }

  static backward(
    matrix: Matrix,
    b: Matrix,
    variables: string[],
    precision: number
  ): [Step[], Matrix] {
    let steps: Step[] = [];
    let solution: Matrix = new Matrix(matrix.getRows(), 1);
    let stepStringBuilder = "";
    steps.push(new Step("$\\blacksquare$ Applying backward substitution:", null));
    for (let row = matrix.getRows() - 1; row >= 0; row--) {
      let sum = b.getElement(row, 0);
      stepStringBuilder = `$$${variables[row]}_${row + 1} = \\frac{${b.getElement(row, 0)}`;
      for (let col = matrix.getCols() - 1; col > row; col--) {
        sum =
          new Big
          (sum, precision)
          .sub(
            new Big
            (matrix.getElement(row, col), precision)
            .mul(solution.getElement(col, 0))
          )
          .getValue();
        stepStringBuilder += ` - ${matrix.getElement(row, col)} \\times ${solution.getElement(col, 0)}`;
      }
      const newValue =
        new Big
        (sum, precision)
        .div(matrix.getElement(row, row))
        .getValue();
      stepStringBuilder += `}{${matrix.getElement(row, row)}} = ${newValue}$$`;
      solution.setElement(row, 0, newValue);
      steps.push(new Step(stepStringBuilder, null));
    }
    steps.push(new Step("$\\blacksquare$ The Solution is:$$" + solution.printLatex() + "$$", null));
    return [steps, solution];
  }
}
