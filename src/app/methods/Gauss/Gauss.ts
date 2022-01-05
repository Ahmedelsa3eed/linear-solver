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

  protected gauss(matrix: Matrix, b: Matrix): [Step[], Matrix, Status] {
    let x: Array<Step> = new Array();
    let stat: Status = Status.UNIQUE;
    console.log(matrix.print());
    x.push(new Step("Coofeciants Matrix :",matrix));
    x.push(new Step("b :",b));
    x.push(new Step("Applying elimination:",matrix,b));
    for (let i = 0; i < matrix.getCols() - 1; i++) {
      matrix = this.partialPivoting(i, i, matrix, b);
      console.log(matrix.print() + b.print());
      for (let j = i + 1; j < matrix.getCols(); j++) {
        const factor =
          new Big
          (matrix.getElement(j, i), this.precision)
          .div(matrix.getElement(i, i))
          .getValue();
        console.log("factor = " + factor);
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
          console.log(matrix.print() + b.print());
          x.push(new Step("$R_" + (j + 1) +" \\Leftarrow "  + -factor + " * " + "R_" + (i + 1) + " + " + "R_" + (j + 1) + "$", matrix,b));
      }
    }
    if (matrix.getElement(matrix.getRows() - 1, matrix.getCols() - 1) == 0 && b.getElement(b.getRows() - 1, 0) == 0) {
      stat = Status.INFINITE;
    }
    if (matrix.getElement(matrix.getRows() - 1, matrix.getCols() - 1) == 0 && b.getElement(b.getRows() - 1, 0) != 0) {
      stat = Status.NO_SOLUTION;
    }
    return [x, matrix, stat];
  }

  solve(matrix: Matrix, b: Matrix): [Step[], Matrix, Status] {
    let step: Step[];
    let stat = Status.UNIQUE;
    const x = new Matrix(matrix.getRows(), 1);
    let res=this.gauss(matrix, b);
    matrix = res[1];
    step=res[0];
    stat=res[2];
    step.push(new Step("Applying Back Substitution :",matrix,b))
    for (let i = matrix.getRows() - 1; i >= 0; i--) {
      let sum = 0;
      
      for (let j = i + 1; j < matrix.getRows(); j++) {
        const factor =
        new Big
        (matrix.getElement(j, i), this.precision)
        .div(matrix.getElement(i, i))
        .getValue();

        sum =
          new Big
          (sum, this.precision)
          .add(
            new Big
            (matrix.getElement(i, j), this.precision)
            .mul(x.getElement(j, 0))
          )
          .getValue();
          // step.push(new Step("$R_" + (j + 1) + " \\Leftarrow " + -factor + " * " + "R_" + (i + 1) + " + " + "R_" + (j + 1) + "$", matrix,b));
      }
      const newValue =
        new Big
        (b.getElement(i, 0), this.precision)
        .sub(sum)
        .div(matrix.getElement(i, i))
        .getValue();
      x.setElement(i, 0, newValue);

    }
    step.push(new Step("The Solution using Gauss : ", x));
    return [step, x, stat];
  }
}
