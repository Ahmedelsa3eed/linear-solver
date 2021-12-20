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
    DooLittle(){
        // decomposes the matrix X into L, U 
        // returns : step[]
    }
    Crout():step[]{
        var steps:step[]=[];
        // var s=0;
        var row, col, k: number;
        var sum = 0;
        steps.push(new step("Applying LU-Crout decomposition",null));
        for (let i = 0; i < this.n; i++) {
            this.U.setElement(i, i, 1);
        }
        steps.push(new step("Constructing L :",null));
        for (col = 0; col < this.n; col++) {
            for (row = col; row < this.n; row++) {
                sum = 0;
                for (k = 0; k < col; k++) {
                    sum = sum + this.L.getElement(row, k) * this.U.getElement(k, col);
                }
                this.L.setElement(row, col, this.X.getElement(row, col) - sum);
                steps.push(new step("L["+col+"]["+row+"] = "+this.X.getElement(row, col)+" - "+sum+" = "+this.L.getElement(row,col),null));
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
                steps.push(new step("U["+col+"]["+row+"] = ("+this.X.getElement(col, row)+" - "+sum+")/"+this.L.getElement(col, col)+" = "+this.U.getElement(col,row),null));
            }
        }
        steps.push(new step("L :",this.L));
        steps.push(new step("U :",this.U));
        return steps;
    }    
    Cholesky():step[]{
        if(!this.X.isPosDef()){
            throw new Error("The matrix is not a positive definite");
        }
        var steps:step[]=[];
        var sum:number;
        steps.push(new step("Applying LU-Cholesky decomposition",null));
        steps.push(new step("Constructing L :",null));
        for (var row = 0; row < this.n; row++) {
            for (var col = 0; col <= row; col++) {
                sum = 0; 
                for (var k = 0; k < col; k++){
                    sum +=this.L.getElement(col,k)*this.L.getElement(row,k);
                }
                if(col==row) {
                    this.L.setElement(row,col,Math.sqrt(this.X.getElement(col,col)-sum));
                    steps.push(new step("L["+row+"]["+col+"] = √("+this.X.getElement(col,col)+" - "+sum+")"+" = "+this.L.getElement(row,col),null));
                }
                else{
                    this.L.setElement(row,col,(this.X.getElement(row,col)-sum)/this.L.getElement(col,col));
                    steps.push(new step("L["+row+"]["+col+"] = ("+this.X.getElement(row,col)+" - "+sum+")/"+this.L.getElement(col,col) +" = "+this.L.getElement(row,col),null));
                }
            }
        }
        steps.push(new step("L :",this.L));
        this.U=this.L.transpose();
        steps.push(new step("Constructing U where U is the transpose of L",this.U));
        return steps;
    }
    //LY=B
    //UX=Y
    SolveFor(b:Matrix):step[]{
        var steps:step[]=[];
        if(b.getCols()!=1||b.getRows()!=this.n){
            throw new Error("b is not a n*1 vector !")
        }
        var Y= LU.Elim(this.L,b,true,"y");
        var X= LU.Elim(this.U,Y[Y.length-1].getMatrix()!,false,"x");
        steps.push(new step("solving LY=B for Y , where Y=UX :",this.L));
        steps=steps.concat(Y);
        steps.push(new step("solving UX=Y for X :",this.U));
        steps=steps.concat(X);
        return steps;
    }
    static Elim(x:Matrix,b:Matrix,Forward:boolean,variable:string):step[]{
        var steps:step[]=[];

        if(x.getRows()!=b.getRows()||b.getCols()!=1){
            throw new Error("Incorrect dimensions for elimination");
        }
        var Solution:Matrix=new Matrix(x.getRows(),1);
        if(Forward){
            steps.push(new step("applying forward elimination",null));
            for(var row=0;row<x.getRows();row++){
                var sum=0;
                for(var col=0;col<row;col++){
                    sum+=x.getElement(row,col)*Solution.getElement(col,0);
                }
                Solution.setElement(row,0,(b.getElement(row,0)-sum)/x.getElement(row,row));
                steps.push(new step(variable+(row+1)+" = "+Solution.getElement(row,0),Solution));
            }
        }
        else{
            steps.push(new step("applying backward elimination",null));
            for(var row=x.getRows()-1;row>-1;row--){
                var sum=0;
                for(var col=x.getCols()-1;col>row;col--){
                    sum+=x.getElement(row,col)*Solution.getElement(col,0);
                }
                Solution.setElement(row,0,(b.getElement(row,0)-sum)/x.getElement(row,row));
                steps.push(new step(variable+(row+1)+" = "+Solution.getElement(row,0),Solution));
            }
        }
        steps.push(new step(variable+" : ",Solution));
        return steps;
    } 
}