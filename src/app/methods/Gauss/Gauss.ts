import { Big } from "src/app/shared/Big";
import { Status } from "src/app/shared/Status.model";
import { Matrix } from "../../shared/Matrix";
import { Step } from "../../shared/Step";


export class Gauss {
  protected precision: number;

  constructor(precision: number = 6) {
    this.precision = precision;
  }

  private largestInColumn(fromRow: number, fromCol: number, matrix: Matrix): number {
    let rowWithLargestNum = fromRow;
    let max = Math.abs(matrix.getElement(fromRow, fromCol));
    for (let i = fromRow + 1; i < matrix.getCols(); i++) {
      if (Math.abs(matrix.getElement(i, fromCol)) > max) {
        max = Math.abs(matrix.getElement(i, fromCol));
        rowWithLargestNum = i;
      }
    }
    return rowWithLargestNum;
  }

  private partialPivoting(
    fromRow: number,
    fromCol: number,
    matrix: Matrix,
    b: Matrix
  ): Matrix {
    const toSwapRow = this.largestInColumn(fromRow, fromCol, matrix);
    matrix.exchangeRows(toSwapRow, fromRow);
    b.exchangeRows(toSwapRow, fromRow);
    return matrix;
  }

  protected gauss(matrix: Matrix, b: Matrix): [Step[], Status] {
    const steps: Array<Step> = new Array();
    let stat: Status = Status.UNIQUE;
    steps.push(new Step(`$$Ax = b$$`, null))
    steps.push(new Step(`$$${matrix.printLatex()}x = ${b.printLatex()}$$`, null))
    steps.push(new Step("$\\blacksquare$ Construct the augmented matrix:", null));
    steps.push(new Step("$$" + matrix.printAugmented(b) + "$$", null));
    steps.push(new Step("$\\blacksquare$ Applying forward elimination:", null))
    for (let i = 0; i < matrix.getRows() - 1; i++) {
      this.partialPivoting(i, i, matrix, b);
      steps.push(new Step(`$\\bigstar$ Apply partial pivoting if applicable:`, null));
      steps.push(new Step("$$" + matrix.printLatex() + "$$", null));
      for (let j = i + 1; j < matrix.getRows(); j++) {
        const factorNumerator = matrix.getElement(j, i);
        const factorDenominator = matrix.getElement(i, i);
        const factor =
          new Big
          (factorNumerator, this.precision)
          .div(factorDenominator)
          .getValue();
        for (let k = i; k < matrix.getCols(); k++) {
          const newValue =
            new Big
            (matrix.getElement(j, k), this.precision)
            .sub(
              new Big
              (factor, this.precision)
              .mul(matrix.getElement(i, k))
            )
            .getValue();
            console.log(matrix.getElement(j,k)-factor*matrix.getElement(i,k)+"this is the new val"+newValue)
          matrix.setElement(j, k, newValue);
        }
        steps.push(new Step(
          (
            `$\\bigstar$ Divide row ${i + 1} by ${factorDenominator} ` +
            `and multiply it by ${factorNumerator}, ` + 
            `subtract the result from row ${j + 1} then ` +
            `substitute new row for row ${j + 1}:`
          ),
          null
        ));
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
      }
    }
    if (matrix.getElement(matrix.getRows() - 1, matrix.getCols() - 1) == 0 && b.getElement(b.getRows() - 1, 0) == 0) {
      steps.push(new Step("$\\because$ Number of pivots of matrix A is equal to that of the augmented matrix but less than number of unknowns.", null));
      steps.push(new Step("$\\therefore$ System of equations has infinite number of solutions.", null));
      stat = Status.INFINITE;
    } else if (matrix.getElement(matrix.getRows() - 1, matrix.getCols() - 1) == 0 && b.getElement(b.getRows() - 1, 0) != 0) {
      steps.push(new Step("$\\because$ Number of pivots of A matrix is different from number of pivots of the augmented matrix matrix.", null));
      steps.push(new Step("$\\therefore$ System of equations is inconsistent and has no solution.", null));
      stat = Status.NO_SOLUTION;
    } else {
      steps.push(new Step("$\\because$ Number of pivots of matrix A is equal to number of unknowns.", null));
      steps.push(new Step("$\\therefore$ System of equations has a unique solution", null));
    }
    return [steps, stat];
  }

  solve(matrix: Matrix, b: Matrix): [Step[], Matrix, Status] {
    const x: Matrix = new Matrix(matrix.getRows(), 1);
    const gaussRes = this.gauss(matrix, b)
    const steps: Step[] = gaussRes[0];
    const stat: Status = gaussRes[1];
    let stepStringBuilder = "";
    if (stat == Status.UNIQUE) {
      steps.push(new Step("$\\blacksquare$ Applying back substitution:", null))
      for (let i = b.getRows() - 1; i >= 0; i--) {
        steps.push(new Step(`$\\bigstar$ Solving for $x_${i + 1}$:`, null));
        stepStringBuilder = "$$";
        for (let k = i; k < matrix.getCols(); k++) {
          stepStringBuilder += `${matrix.getElement(i, k)}x_${k + 1}`;
          if (k != matrix.getCols() - 1) {
            stepStringBuilder += " + ";
          }
        }
        stepStringBuilder += " = " + b.getElement(i, 0) + "$$";
        steps.push(new Step(stepStringBuilder, null));
        let x_i = b.getElement(i, 0);
        stepStringBuilder = `$$x_${i + 1} = \\frac{${x_i}`;
        for (let j = matrix.getCols() - 1; j > i; j--) {
          x_i = 
            new Big
            (x_i, this.precision)
            .sub(
              new Big
              (matrix.getElement(i, j), this.precision)
              .mul(x.getElement(j, 0))
            )
            .getValue();
          stepStringBuilder += ` - ${matrix.getElement(i, j)} \\times ${x.getElement(j, 0)}`;
        }
        x_i =
          new Big
          (x_i, this.precision)
          .div(matrix.getElement(i, i))
          .getValue();
        stepStringBuilder += `}{${matrix.getElement(i, i)}} = ${x_i}$$`;
        x.setElement(i, 0, x_i);
        steps.push(new Step(stepStringBuilder, null));
      }
      steps.push(new Step("$\\blacksquare$ The Solution is:$$" + x.printLatex() + "$$", null));
    }
    return [steps, x, stat];
  }
}
