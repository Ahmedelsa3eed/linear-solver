import { Gauss } from "./Gauss";
import { Matrix } from "./Matrix";

export class GaussJordan extends Gauss {
  private dividByPivotElement (
    fromRow: number,
    fromCol: number,
    matrix: Matrix,
    b: Matrix
  ) {
    const pivot: number = matrix.getElement(fromRow, fromCol);
    for (let i = fromCol; i < matrix.getCols(); i++) {
      matrix.setElement(fromRow, i, matrix.getElement(fromRow, i) / pivot);
    }
    b.setElement(fromRow, 0, b.getElement(fromRow, 0) / pivot);
  }

  private gaussJordan(matrix: Matrix, b: Matrix): Matrix {
    console.log(matrix.print());
    this.gauss(matrix, b);
    this.x.push("1 / " + matrix.getElement(0, 0) + " * " + "Row 1 " + "Store in Row 1");
    this.dividByPivotElement(0, 0, matrix, b);
    console.log(matrix.print());
    console.log(b.print());
    for (let i = matrix.getRows() - 1; i > 0; i--) {
      this.x.push("1 / " + matrix.getElement(i, i) + " * " + "Row " + (i + 1) + " Store in Row " + (i + 1));
      this.dividByPivotElement(i, i, matrix, b);
      console.log(matrix.print());
      console.log(b.print());
      for (let j = i - 1; j >= 0; j--) {
        const factor = matrix.getElement(j, i) / matrix.getElement(i, i);
        this.x.push(-Math.round(factor * 10000) / 10000 + " * " + "Row " + (i + 1) + " +" + " Row " + (j + 1) + " store in Row " + (j + 1));
        matrix.setElement(j, i, matrix.getElement(j, i) - factor * matrix.getElement(i, i));
        b.setElement(j, 0, b.getElement(j, 0) - factor * b.getElement(i, 0));
        console.log(matrix.print());
        console.log(b.print());
      }
    }
    console.log(matrix.print() + b.print());
    console.log(this.x);
    return matrix;
  }

  override solve(matrix: Matrix, b: Matrix): Matrix {
    matrix = this.gaussJordan(matrix, b);
    let x: Matrix;
    x = b.clone();
    return x;
  }
}
