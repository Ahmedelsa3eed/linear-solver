import {Matrix} from "./Matrix";
import {step} from "./step";


export class Substitution {

  static forward(matrix: Matrix, b: Matrix,variable: string): [step[], Matrix] {
    let steps: step[] = [];

    let Solution: Matrix = new Matrix(matrix.getRows(), 1);

    steps.push(new step("Applying Forward Substitution", matrix.clone()));
 //   for(let i = 0; i < 3; i++) console.log(i, " o[i] is ", i);
    for (let row = 0; row < matrix.getRows(); row++) {
      let sum = 0;
      for (let col = 0; col < row; col++) {
        sum += matrix.getElement(row, col) * Solution.getElement(col, 0);
      }
      Solution.setElement(row, 0, (b.getElement(row, 0) - sum) / matrix.getElement(row, row));
      steps.push(new step(variable + (row + 1) + " = " + Solution.getElement(row, 0), Solution.clone()));
    }

    steps.push(new step(variable + " : ", Solution));
    let result = <Matrix>steps[steps.length - 1].getMatrix();
    return [steps, result];
  }


  static backward(matrix: Matrix, b: Matrix, variable: string): [step[], Matrix] {
    let steps: step[] = [];
    // let o  = [0,1,2];

    let Solution: Matrix = new Matrix(matrix.getRows(), 1);
    steps.push(new step("Applying Backward Substitution", matrix.clone()));
//    for(let i = 0; i < 3; i++) console.log(i, " o[i] is ", i);

    for (let row = matrix.getRows() - 1; row > -1; row--) {
      let sum = 0;
      for (let col = matrix.getCols() - 1; col > row; col--) {
        sum += matrix.getElement(row, col) * Solution.getElement(col, 0);
      }
      Solution.setElement(row, 0, (b.getElement(row, 0) - sum) / matrix.getElement(row, row));
      steps.push(new step(variable + (row + 1) + " = " + Solution.getElement(row, 0), Solution.clone()));
    }

    steps.push(new step(variable + " : ", Solution.clone()));
    let result = <Matrix>steps[steps.length - 1].getMatrix();
    return [steps, result];
  }


}
