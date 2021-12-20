import { TestBed } from '@angular/core/testing';
import { LU } from './LU';
import { Matrix } from './Matrix';

describe('LU', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [
          LU
        ],
      }).compileComponents();
    });
    it("should crout-decompose a Matrix 3*3",()=>{
        const lu=new LU();
        const matrixA = Matrix.fromArray([
            [2,  3, -1],
            [3,  2,  1],
            [1, -5,  3]
        ]);
        lu.SetMatrix(matrixA);
        const T=lu.Crout();
        const L=lu.getL();
        const U=lu.getU();
        console.log(T);
        //L:
        expect(L.getElement(0, 0)).toEqual(2);
        expect(L.getElement(0, 1)).toEqual(0);
        expect(L.getElement(0, 2)).toEqual(0);
        expect(L.getElement(1, 0)).toEqual(3);
        expect(L.getElement(1, 1)).toEqual(-5/2);
        expect(L.getElement(1, 2)).toEqual(0);
        expect(L.getElement(2, 0)).toEqual(1);
        expect(L.getElement(2, 1)).toEqual(-13/2);
        expect(L.getElement(2, 2)).toEqual(-3);
        //U:
        expect(U.getElement(0, 0)).toEqual(1);
        expect(U.getElement(0, 1)).toEqual(3/2);
        expect(U.getElement(0, 2)).toEqual(-1/2);
        expect(U.getElement(1, 0)).toEqual(0);
        expect(U.getElement(1, 1)).toEqual(1);
        expect(U.getElement(1, 2)).toEqual(-1);
        expect(U.getElement(2, 0)).toEqual(0);
        expect(U.getElement(2, 1)).toEqual(0);
        expect(U.getElement(2, 2)).toEqual(1);

    });
    it("should cholesky-decompose a positive definite Matrix 3*3",()=>{
      const lu=new LU();
      const matrixA = Matrix.fromArray([
          [4,  12, -16],
          [12,  37,  -43],
          [-16, -43,  98]
      ]);
      lu.SetMatrix(matrixA);
      const T=lu.Cholesky();
      const L=lu.getL();
      const U=lu.getU();
      console.log(T);
      //L:
      expect(L.getElement(0, 0)).toEqual(2);
      expect(L.getElement(0, 1)).toEqual(0);
      expect(L.getElement(0, 2)).toEqual(0);
      expect(L.getElement(1, 0)).toEqual(6);
      expect(L.getElement(1, 1)).toEqual(1);
      expect(L.getElement(1, 2)).toEqual(0);
      expect(L.getElement(2, 0)).toEqual(-8);
      expect(L.getElement(2, 1)).toEqual(5);
      expect(L.getElement(2, 2)).toEqual(3);

    });
    it("should solve a Matrix 3*3 using LU",()=>{
        const lu=new LU();
        const matrixA = Matrix.fromArray([
            [2,  3, -1],
            [3,  2,  1],
            [1, -5,  3]
        ]);
        lu.SetMatrix(matrixA);
        lu.Crout();
        const b =Matrix.fromArray([
          [5],
          [10],
          [0]
        ]);
        const L=lu.SolveFor(b);
        // const U=lu.getU();
        //L:
        
        expect(L[L.length-1].getMatrix()!.getElement(0, 0)).toEqual(1);
        expect(L[L.length-1].getMatrix()!.getElement(1, 0)).toEqual(2);
        expect(L[L.length-1].getMatrix()!.getElement(2, 0)).toEqual(3);
    })
});