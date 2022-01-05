import { Big } from "src/app/shared/Big";
import { Status } from "src/app/shared/Status.model";
import { Matrix } from "../../shared/Matrix";
import { Step } from "../../shared/Step";

export class Jacobi {
   A!: Matrix; //the coofeciant matrix
   B!: Matrix; //the result matrix
   intialGuess!: number[];
   es!: number;
   imax!: number;
   n!: number; //the number of rows (square matrix)
   precision: number;

  constructor(
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

  public setMatrix(M: Matrix) {
    if (M.getRows() != M.getCols()) {
      throw new Error("The matrix isn't square");
    }
    this.A = M.clone();
    this.n = M.getRows();
  }

  solve(A:Matrix,B:Matrix,initialGuess:number[],vars:string[],es?:number,imax?:number): [Step[], Matrix, Status] {
    let steps = this.showTheFormula(vars);
    try{this.setMatrix(A);}
    catch(e:any){
      return([steps,A,Status.ERROR]);
    }
    this.B=B.clone();
    this.intialGuess=initialGuess;
    if(es){this.es=es;}
    if(imax){this.imax=imax;}
    let x: number[][] = [];
    const ea = [];
    let guess = this.intialGuess;
    for (let k = 0; k < this.imax; k++) {
      x[k] = [];
      steps.push(new Step("$----------------------$",null))
      // steps.push(new Step("$Iteration #" + (k), null));
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
              .getValue();

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
          .getValue();
        ea[i] =
          new Big
          (x[k][i], this.precision)
          .sub(guess[i])
          .div(x[k][i])
          .abs()
          .getValue();
        steps.push(new Step("$"+vars[i]+"_{"+k+"} = "+'\\frac{'+Big.Precise(this.B.getElement(i,0),this.precision)+" - "+Sum+'}{'+Big.Precise(this.A.getElement(i, i),this.precision)+'}'+" = "+x[k][i]+"$",null))
      }

      for (let i = 0; i < this.n; i++) guess[i] = x[k][i];

      var max = ea[0];
      for (let i = 1; i < ea.length; i++) if (ea[i] > max) max = ea[i];
      let res=new Matrix(this.n,1)
        for (let index = 0; index < guess.length; index++) {
          res.setElement(index,0,guess[index]);
        }
        steps.push(new Step("$e = "+max*100+" \\%$",res));

      if (this.es != 0 && max < this.es) break;

      if (this.imax > 1000) break;
    }
    let res=new Matrix(this.n,1)
    for (let index = 0; index < guess.length; index++) {
       res.setElement(index,0,guess[index]);
    }
    return [steps,res, Status.UNIQUE];
  }

  public showTheFormula(vars:string[]): Step[] {
    const equations: Step[] = [];
    for (let i = 0; i < this.n; i++) {
      let st = "$";
      st += vars[i] + " = \\frac{";
      st += this.B.getElement(i, 0);
      for (let j = 0; j < this.n; j++) {
        if (i != j) st += "+ ( " + -1*this.A.getElement(i, j) +" )"+ vars[j];
      }
      st += "}{" + this.A.getElement(i, i)+"}$";
      equations[i] = new Step(st, null);
    }
    return equations;
  }
}
