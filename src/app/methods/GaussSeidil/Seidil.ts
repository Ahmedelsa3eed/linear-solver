import { Big } from "src/app/shared/Big";
import { Matrix } from "../../shared/Matrix";
import { Step } from "../../shared/Step";

export class Seidil {
  private A!: Matrix; //the coofeciant matrix
  private B!: Matrix; //the result matrix
  private intialGuess!: number[];
  private es!: number;
  private imax!: number;
  private n!: number; //the number of rows (square matrix),
  private precision: number;

  constructor (
    A?: Matrix,
    B?: Matrix,
    intialGuess?: number[],
    es?: number,
    imax: number = 1000,
    precision: number = 6
  ) {
    if (A && B && intialGuess) {
      this.setMatrix(A);
      this.B = B.clone();
      this.intialGuess = intialGuess;
      this.imax = imax;
    }
    this.es = 0;
    if (es) this.es = es;
    this.precision = precision;
  }

  private setMatrix(M: Matrix) {
    if (M.getRows() != M.getCols()) {
      throw new Error("The matrix isn't square");
    }
    this.A = M.clone();
    this.n = M.getRows();
  }
  //imax has a default value of 1000
  solve(A:Matrix,B:Matrix,initialGuess:number[],vars:string[],es?:number,imax?:number): [Step[], Matrix, string] {
    let steps = this.showTheFormula();
    try{this.setMatrix(A);}
    catch(e:any){
      return([steps,A,"ERROR"]);
    }
    this.B=B.clone();
    this.intialGuess=initialGuess;
    if(es){this.es=es;}
    if(imax){this.imax=imax;}

    let x: number[][] = [];
    const ea = [];
    const guess = this.intialGuess;
    for (let k = 0; k < this.imax; k++) {
      x[k] = [];
      steps.push(new Step("\nIteration #" + (k + 1),null));
      for (let i = 0; i < this.n; i++) {
        x[k][i] = this.B.getElement(i, 0);
        var Sum="( ";
        for (let j = 0; j < this.n; j++) {
          if (i != j) {
            x[k][i] =
              new Big
              (x[k][i], this.precision)
              .sub(
                new Big
                (this.A.getElement(i, j), this.precision)
                .mul(guess[j])
              )
              .getValue()

              Sum+=Big.Precise(this.A.getElement(i, j),this.precision)+" * "+Big.Precise(guess[j],this.precision);
 
              if(!(j==this.n-1||(j==i-1&&i==this.n-1))){
                Sum+=" + ";
              }
          }
        }
        Sum+=" )";
        x[k][i] =
          new Big
          (x[k][i], this.precision)
          .div(this.A.getElement(i, i))
          .getValue()
        ea[i] =
          new Big
          (x[k][i], this.precision)
          .sub(guess[i])
          .div(x[k][i])
          .abs()
          .getValue()
          guess[i] = x[k][i];
          steps.push(new Step(vars[i]+"_"+k+" = "+'\\frac{'+Big.Precise(x[k][i],this.precision)+" - "+Sum+'}{'+Big.Precise(x[k][i],this.precision)+'}',null))
      }

      var max = ea[0];
      for (let i = 1; i < ea.length; i++) if (ea[i] > max) max = ea[i];

      if (this.es != 0 && max <= this.es) break;

      if (this.imax > 1000) break;
    }

    return [steps, Matrix.fromArray(x), "(O.O)"];
  }

  private showTheFormula(): Step[] {
    const equations: Step[] = [];
    for (let i = 0; i < this.n; i++) {
      let st = "";
      st += "x" + (i + 1) + " = (";
      st += this.B.getElement(i, 0);
      for (let j = 0; j < this.n; j++) {
        if (i != j) st += "-" + this.A.getElement(i, j) + "x" + (j + 1);
      }
      st += ") / " + this.A.getElement(i, i);
      equations[i] = new Step(st, null);
    }
    return equations;
  }
}
