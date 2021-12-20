import { Gauss } from "./Gauss";
import {Matrix} from "./Matrix";

export class GaussJordan extends Gauss{


    dividByPivotElement(fromRow:number,fromCol:number,matrix:Matrix,b:Matrix){
        let pivot:number;
        pivot=matrix.getElement(fromRow,fromCol)

        for(let i=fromCol;i<matrix.getCols();i++){

            matrix.setElement(fromRow,i,matrix.getElement(fromRow,i)/pivot)


          }
          b.setElement(fromRow,0,b.getElement(fromRow,0)/pivot)
          
      }
      
    gaussJordan(fromRow:number,fromCol:number,matrix:Matrix,b:Matrix):Matrix{
        let factor;
        console.log(matrix.print())
        this.gauss(matrix,b)
        console.log("1 / "+ matrix.getElement(0,0)+" * " +"Row 1 " +"Store in Row 1" )
        this.dividByPivotElement(0,0,matrix,b)
        console.log(matrix.print())
        console.log(b.print()) 
        for (let i = matrix.getRows()-1 ;i>0;i--){

          console.log("1 / "+ matrix.getElement(i,i)+" * " +"Row "+(i+1) +"Store in Row "+(i+1) )
          this.dividByPivotElement(i,i,matrix,b)
          console.log(matrix.print())
            console.log(b.print()) 
          for (let j = i-1 ; j >= 0 ; j--){
           

            factor=matrix.getElement(j,i)/matrix.getElement(i,i);
            console.log("factor = "+factor)
            console.log(-Math.round(factor*10000)/10000+" * "+ "Row "+ (i+1)+" +"+" Row "+(j+1) +" store in Row "+(j+1))
           
            matrix.setElement(j,i,matrix.getElement(j,i)-factor*matrix.getElement(i,i));
              
            b.setElement(j,0,(b.getElement(j,0) - factor * b.getElement(i,0)));
            console.log(matrix.print())
            console.log(b.print()) 
          }

        }
        
        console.log(matrix.print() + b.print())
        return matrix;
      }

    
   

}
