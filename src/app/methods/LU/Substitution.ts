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

    steps.push(new Step("Applying Forward Substitution", matrix.clone()));
    for (let row = 0; row < matrix.getRows(); row++) {
      let sum = 0;
      for (let col = 0; col < row; col++) {
        sum =
          new Big
          (sum, precision)
          .add(
            new Big
            (matrix.getElement(row, col), precision)
            .mul(solution.getElement(col, 0))
          )
          .getValue();
      }
      const newValue =
        new Big
        (b.getElement(row, 0), precision)
        .sub(sum)
        .div(matrix.getElement(row, row))
        .getValue();
      solution.setElement(row, 0, newValue);
      steps.push(new Step(variable + (row + 1) + " = " + solution.getElement(row, 0), solution.clone()));
    }

    steps.push(new Step(variable + " : ", solution));
    let result = <Matrix>steps[steps.length - 1].getMatrix();
    return [steps, result];
  }

  static backward(
    matrix: Matrix,
    b: Matrix,
    variables: string[],
    precision: number
  ): [Step[], Matrix] {
    let steps: Step[] = [];

    let solution: Matrix = new Matrix(matrix.getRows(), 1);
    steps.push(new Step("Applying Backward Substitution", matrix));

    for (let row = matrix.getRows() - 1; row > -1; row--) {
      let sum = 0;
      for (let col = matrix.getCols() - 1; col > row; col--) {
        sum =
          new Big
          (sum, precision)
          .add(
            new Big
            (matrix.getElement(row, col), precision)
            .mul(solution.getElement(col, 0))
          )
          .getValue();
      }
      const newValue =
        new Big
        (b.getElement(row, 0), precision)
        .sub(sum)
        .div(matrix.getElement(row, row))
        .getValue();
      solution.setElement(row, 0, newValue);
      steps.push(new Step(variables[row] + " = " + solution.getElement(row, 0), solution));
    }

    steps.push(new Step("Solution : ", solution));
    let result = <Matrix>steps[steps.length - 1].getMatrix();
    return [steps, result];
  }
}
