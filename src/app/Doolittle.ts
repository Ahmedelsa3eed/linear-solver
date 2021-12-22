import {Matrix} from "./Matrix";
import {step} from "./step";
import {Substitution} from "./Substitution";


export class Doolittle {

  private static partialPivotIn(U: Matrix, currentRow: number): number {
    let indexOfMaxPivot = currentRow;
    for(let i = currentRow + 1; i < U.getRows(); i++)
      if(Math.abs(U.getElement(i, currentRow)) > Math.abs(U.getElement(indexOfMaxPivot, currentRow))) indexOfMaxPivot = i;

    return indexOfMaxPivot;
  }

  //  private static fixRow(U: Matrix, row: number): number {
  //   if (U.getElement(row, row) == 0) {
  //     for (let i = row + 1; i < U.getRows(); i++) {
  //       if (U.getElement(i, row) != 0) {
  //         // return the index of the row to exchange with
  //         return i;
  //       }
  //     }
  //   }
  //   return -1;
  // }

  private static factorization(U: Matrix): [Matrix, Matrix, step[], any[]] {
    console.log("matrix to be factorized\n", U.print());
    let o = [];
    for(let i = 0; i < U.getRows(); i++) o[i] = i;
    let steps:step[]=[];
    let L: Matrix = new Matrix(U.getRows(), U.getCols());

  for (let i = 0; i < U.getRows() - 1; i++) {
    let fix = this.partialPivotIn(U, i);

    if(fix != i) {
      let temp: number = o[fix];
      o[fix] = o[i];
      o[i] = temp;
      U.exchangeRows(i, fix);
      L.exchangeRows(i, fix);
      steps.push(new step(`Apply Partial Pivoting Exchange Row ${fix} with Row ${i}`, U.clone()));
      console.log(`Apply Partial Pivoting Exchange Row ${fix+1} with Row ${i+1}\n`, U.print());
    }

    for (let row = i + 1; row < U.getRows(); row++) {

      let scalar = -1 * (U.getElement(row, i) / U.getElement(i, i));

      for (let col = 0; col < U.getCols(); col++) {
//         console.log("setElement : ", scalar , " " , U.getElement(i, col) , " + " , U.getElement(row, col));
        U.setElement(row, col, scalar * U.getElement(i, col) + U.getElement(row, col));
      }
      steps.push(new step(`${scalar}R${i+1} + R${row+1} ==> R${row+1}`, U.clone()));
      console.log(`${scalar}R${i+1} + R${row+1} ==> R${row+1}`);
      // console.log(-1 * scalar , " + ", L.getElement(row, i))
      L.setElement(row, i, -1 * scalar + L.getElement(row, i));
      steps.push(new step(`Now Element L${row}${i} Become ${-1 * scalar + L.getElement(row, i)}`, L.clone()))

//   console.log("lower ", i, " : \n", L.print());
//   console.log("upper ", i, "  : \n", U.print());
    }

  }
  for(let i = 0; i < U.getRows(); i++) L.setElement(i, i, 1);// Initialize the main diagonal

  console.log("lower  : \n", L.print());
  console.log("upper  : \n", U.print());

  return [L, U, steps, o];
}

  static solve(matrix: Matrix, a: Matrix): [step[], Matrix] {
    let [L, U, steps, o] = this.factorization(matrix);
    let b= new Matrix(3, 1);

    for(let i = 0; i < o.length; i++) b.setElement(i, 0, a.getElement(o[i], 0));

    let x =  Substitution.forward(L, b, "Y");
    steps.push(...x[0]);

    let y = Substitution.backward(U, x[1],"X");
    steps.push(...y[0]);

    return [steps, y[1]];
  }




}
