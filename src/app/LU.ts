import { Matrix } from './Matrix';
import { step } from './step';

export class LU {
    X!: Matrix;  //the coofeciant matrix
    L!: Matrix;
    U!: Matrix;
    n!: number;  //the number of rows (square matrix)
    constructor(M?: Matrix) {
        this.n=3;
        if(M){
            this.SetMatrix(M);
        }
        this.L = new Matrix(this.n, this.n);
        this.U = new Matrix(this.n, this.n);
    }
    SetMatrix(M: Matrix) {
        if (M.getRows() != M.getCols()) {
            throw new Error("The matrix isn't square");
        }
        this.X = M.clone();
        this.n = M.getRows();
    }
    getL(){
        return this.L;
    }
    getU(){
        return this.U;
    }
    Crout(){
        var steps:step[]=[];
        // var s=0;
        let row, col, k: number;
        let sum = 0;

        for (let i = 0; i < this.n; i++) {
            this.U.setElement(i, i, 1);
        }

        for (col = 0; col < this.n; col++) {
            for (row = col; row < this.n; row++) {
                sum = 0;
                for (k = 0; k < col; k++) {
                    sum = sum + this.L.getElement(row, k) * this.U.getElement(k, col);
                }
                this.L.setElement(row, col, this.X.getElement(row, col) - sum);

                steps.push(new step("Compute L["+row+"]["+col+"]",this.L.clone()));
            }

            for (row = col; row < this.n; row++) {
                if (this.L.getElement(col, col) == 0) {
                    throw new Error("Matrix can't be decomposed");
                }
                sum = 0;
                for (k = 0; k < col; k++) {
                    sum = sum + this.L.getElement(col, k) * this.U.getElement(k, row);
                }
                this.U.setElement(col, row, (this.X.getElement(col, row) - sum) / this.L.getElement(col, col));
                steps.push(new step("computing U["+col+"]["+row+"]",this.U.clone()));
            }
        }
    }    
    //LY=B
    //UX=Y
    SolveFor(b:Matrix):Matrix{
        if(b.getCols()!=1||b.getRows()!=this.n){
            throw new Error("b is not a n*1 vector !")
        }
        var Y= LU.Elim(this.L,b,true);
        return LU.Elim(this.U,Y,false);
    }
    static Elim(x:Matrix,b:Matrix,Forward:boolean):Matrix{
        if(x.getRows()!=b.getRows()||b.getCols()!=1){
            throw new Error("Incorrect dimensions for forward elimination");
        }
        var Solution:Matrix=new Matrix(x.getRows(),1);
        if(Forward){
            for(var row=0;row<x.getRows();row++){
                var sum=0;
                for(var col=0;col<row;col++){
                    sum+=x.getElement(row,col)*Solution.getElement(col,0);
                }
                Solution.setElement(row,0,(b.getElement(row,0)-sum)/x.getElement(row,row));
            }
        }
        else{
            for(var row=x.getRows()-1;row>-1;row--){
                var sum=0;
                for(var col=x.getCols()-1;col>row;col--){
                    sum+=x.getElement(row,col)*Solution.getElement(col,0);
                }
                Solution.setElement(row,0,(b.getElement(row,0)-sum)/x.getElement(row,row));
            }
        }
        return Solution;
    } 
}