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
    b.setElement(Row, 0, b.getElement(Row, 0) / pivot);
  }

  private gaussJordan(matrix: Matrix, b: Matrix): [Step[], Matrix, Status] {
    console.log(matrix.print());
    let GaussRes = this.gauss(matrix, b);
    let x = GaussRes[0];
    let stat = GaussRes[2];
    if (stat === Status.INFINITE || stat === Status.NO_SOLUTION) {
      return [x, matrix, stat];
    }
    console.log(matrix.print());
    console.log(b.print());
    for (let i = matrix.getRows() - 1; i >= 0; i--) {
      this.dividByPivotElement(i, i, matrix, b);
      x.push(new Step("$R_" + (i + 1) + " \\Leftarrow " + "1 /" + matrix.getElement(i, i) + " * " + "R_" + (i + 1) + "$", matrix));
      console.log(matrix.print());
      console.log(b.print());
      for (let j = i - 1; j >= 0; j--) {
        const factor =
          new Big
          (matrix.getElement(j, i), this.precision)
          .div(matrix.getElement(i, i))
          .getValue();
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
        x.push(new Step("$R_" + (j + 1) + " \\Leftarrow " + -factor + " * " + "R_" + (i + 1) + " + " + "R_" + (j + 1) + "$", matrix));
        console.log(matrix.print());
        console.log(b.print());
      }
    }
    x.push(new Step("Solution:", b));
    console.log(matrix.print() + b.print());
    console.log(x);
    return [x, b.clone(), stat];
  }

  override solve(matrix: Matrix, b: Matrix): [Step[], Matrix, Status] {
    return this.gaussJordan(matrix, b);
  }
}
