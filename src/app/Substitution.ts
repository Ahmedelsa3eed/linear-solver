import { Matrix } from "./Matrix";
import { Step } from "./Step";

export class Substitution {
  static forward(matrix: Matrix, b: Matrix, variable: string): [Step[], Matrix] {
    let steps: Step[] = [];

    let solution: Matrix = new Matrix(matrix.getRows(), 1);

    steps.push(new Step("Applying Forward Substitution", matrix.clone()));
    //   for(let i = 0; i < 3; i++) console.log(i, " o[i] is ", i);
    for (let row = 0; row < matrix.getRows(); row++) {
      let sum = 0;
      for (let col = 0; col < row; col++) {
        sum += matrix.getElement(row, col) * solution.getElement(col, 0);
      }
      solution.setElement(row, 0, (b.getElement(row, 0) - sum) / matrix.getElement(row, row));
      steps.push(new Step(variable + (row + 1) + " = " + solution.getElement(row, 0), solution.clone()));
    }

    steps.push(new Step(variable + " : ", solution));
    let result = <Matrix>steps[steps.length - 1].getMatrix();
    return [steps, result];
  }

  static backward(matrix: Matrix, b: Matrix, variable: string): [Step[], Matrix] {
    let steps: Step[] = [];
    // let o  = [0,1,2];

    let solution: Matrix = new Matrix(matrix.getRows(), 1);
    steps.push(new Step("Applying Backward Substitution", matrix.clone()));
    //    for(let i = 0; i < 3; i++) console.log(i, " o[i] is ", i);

    for (let row = matrix.getRows() - 1; row > -1; row--) {
      let sum = 0;
      for (let col = matrix.getCols() - 1; col > row; col--) {
        sum += matrix.getElement(row, col) * solution.getElement(col, 0);
      }
      solution.setElement(row, 0, (b.getElement(row, 0) - sum) / matrix.getElement(row, row));
      steps.push(new Step(variable + (row + 1) + " = " + solution.getElement(row, 0), solution.clone()));
    }

    steps.push(new Step(variable + " : ", solution.clone()));
    let result = <Matrix>steps[steps.length - 1].getMatrix();
    return [steps, result];
  }
}
