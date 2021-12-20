import {Matrix} from "./Matrix";

export class Gauss {

  largestInColumn(fromRow:number,fromCol:number,matrix:Matrix):number{

    let rowWithLargestNum=fromRow;
    let max=Math.abs(matrix.getElement(fromRow,fromCol));

    for (let i=fromRow+1;i<matrix.getCols();i++){
      if (Math.abs(matrix.getElement(i,fromCol))>max){
        max=Math.abs(matrix.getElement(i,fromCol));
        rowWithLargestNum=i;
      }
    }
    return rowWithLargestNum;
  }
  partialPivoting(fromRow:number,fromCol:number,matrix:Matrix,b:Matrix):Matrix{
    let toSwapRow=this.largestInColumn(fromRow,fromCol,matrix);
    matrix.exchangeRows(toSwapRow,fromRow);
    b.exchangeRows(toSwapRow,fromRow)
    return matrix;
  }

  gauss(matrix:Matrix,b:Matrix):Matrix{
    let factor;
    console.log(matrix.print())
    for (let i=0;i<matrix.getCols()-1;i++){
      matrix=this.partialPivoting(i,i,matrix,b)
      console.log(matrix.print()+b.print())

      for (let j=i+1;j<matrix.getCols();j++){

        factor=matrix.getElement(j,i)/matrix.getElement(i,i);
        console.log("factor = "+factor)
        console.log(-Math.round(factor*10000)/10000+" * "+ "Row "+ (i+1)+" +"+" Row "+(j+1) +" store in Row "+(j+1))
        for (let k=i;k<matrix.getCols();k++){

          matrix.setElement(j,k,matrix.getElement(j,k)-factor*matrix.getElement(i,k));

        }
        b.setElement(j,0,(b.getElement(j,0)-factor*b.getElement(i,0)));
        console.log(matrix.print() + b.print())
      }

    }
    console.log(matrix.print() + b.print())
    return matrix;
  }
  getAnsGuss(matrix:Matrix,b:Matrix){
    let x=new Matrix(matrix.getRows(),1);

    x.setElement(1,1,5)
    matrix=this.gauss(matrix,b)
    console.log("after elimination \n"+matrix.print(),b.print())

    for(let i =matrix.getRows()-1;i>=0;i--){

        let sum=0

        for(let j=i+1;j<matrix.getRows();j++){

          sum = sum + matrix.getElement(i,j)*x.getElement(j,0)

        }

        x.setElement(i,0,Math.round( (b.getElement(i,0)-sum)/matrix.getElement(i,i)*1000)/1000 )
        console.log(x.print())
    }




  }

}
