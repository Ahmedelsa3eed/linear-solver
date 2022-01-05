import { LU } from "./LU";
import { Matrix } from "../../shared/Matrix";
import { Step } from "../../shared/Step";
import { Big } from "src/app/shared/Big";
import { Status } from "src/app/shared/Status.model";

export class Doolittle extends LU {
  private static partialPivotIn(U: Matrix, currentRow: number): number {
    let indexOfMaxPivot = currentRow;
    for (let i = currentRow + 1; i < U.getRows(); i++) {
      if (Math.abs(U.getElement(i, currentRow)) > Math.abs(U.getElement(indexOfMaxPivot, currentRow))) {
        indexOfMaxPivot = i;
      }
    }
    return indexOfMaxPivot;
  }

  public override solve(U: Matrix,b:Matrix,vars:string[]): [Step[],Matrix, Status] {
    console.log("matrix to be factorized\n", U.print());
    let stat = Status.FACTORISABLE;
    let o = [];
    for (let i = 0; i < U.getRows(); i++) o[i] = i;
    let steps: Step[] = [];
    let L: Matrix = new Matrix(U.getRows(), U.getCols());

    if (U.getCols() != U.getRows()) {
      stat = Status.NOT_FACTORISABLE;
      return [steps,L, stat];
    }
    for (let i = 0; i < U.getRows() - 1; i++) {
      let fix = Doolittle.partialPivotIn(U, i);
      if (fix == 0) {
        stat = Status.NOT_FACTORISABLE;
        return [steps,L, stat];
      }
      if (fix != i) {
        let temp: number = o[fix];
        o[fix] = o[i];
        o[i] = temp;
        U.exchangeRows(i, fix);
        L.exchangeRows(i, fix);
        steps.push(new Step(`Apply Partial Pivoting Exchange Row ${fix+1} with Row ${i+1}`, U));
        console.log(`Apply Partial Pivoting Exchange Row ${fix + 1} with Row ${i + 1}$\\newline$`, U);
      }

      for (let row = i + 1; row < U.getRows(); row++) {
        const scalar =
          new Big
          (U.getElement(row, i), this.precision)
          .div(U.getElement(i, i))
          .mul(-1)
          .getValue();
          steps.push(new Step("\nScaler for R_"+i+1+" = "+(-1*Big.Precise(U.getElement(row, i),this.precision))+" / "+Big.Precise(U.getElement(i, i),this.precision),null));
        for (let col = 0; col < U.getCols(); col++) {
          // console.log("setElement : ", scalar , " " , U.getElement(i, col) , " + " , U.getElement(row, col));
          let str=scalar+" * "+Big.Precise(U.getElement(i, col),this.precision)+" + "+Big.Precise(U.getElement(row, col),this.precision)
          const newValue =
            new Big
            (scalar, this.precision)
            .mul(U.getElement(i, col))
            .add(U.getElement(row, col))
            .getValue();
          U.setElement(row, col, newValue);
          steps.push(new Step("U_{"+row+""+col+"}"+" = "+str,U));
        }
        steps.push(new Step("$\\newline$"+`${scalar}R${i + 1} + R${row + 1} \\Rightarrow R${row + 1}`, U));
        // console.log(`${scalar}R_${i + 1}\ + R_${row + 1} \\Rightarrow R_${row + 1}`);
        // console.log(-1 * scalar , " + ", L.getElement(row, i))
        const newValue =
          new Big
          (-1, this.precision)
          .mul(scalar)
          .add(L.getElement(row, i))
          .getValue();
        L.setElement(row, i, newValue);
        steps.push(new Step(`Now Element L_\{${row}${i}\} has become ${newValue}`, L));
        
        // console.log("lower ", i, " : \n", L.print());
        // console.log("upper ", i, "  : \n", U.print());
      }
    }
    for (let i = 0; i < U.getRows(); i++) L.setElement(i, i, 1); // Initialize the main diagonal
    steps.push(new Step("$\\newline$L :",L));
    steps.push(new Step("$\\newline$U :",U));
    let sol=this.Solve(L,U,b,vars,steps,o)
    
    return [steps,sol, stat];
  }

  // static solve(matrix: Matrix, a: Matrix): [Step[], Matrix] {
  //   let [L, U, steps, o] = this.factorization(matrix);
  //   let b= new Matrix(3, 1);

  //   for(let i = 0; i < o.length; i++) b.setElement(i, 0, a.getElement(o[i], 0));

  //   let x =  Substitution.forward(L, b, "Y");
  //   steps.push(...x[0]);

  //   let y = Substitution.backward(U, x[1],"X");
  //   steps.push(...y[0]);

  //   return [steps, y[1]];
  // }

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
}
