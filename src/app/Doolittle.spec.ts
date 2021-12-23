import { TestBed } from '@angular/core/testing';
import { Matrix } from './Matrix';
import { Doolittle } from './Doolittle';

describe('Doolittle', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Doolittle],
    }).compileComponents();
  });
  it('mohamed ayman doolittle', () => {
    // const matrixA = Matrix.fromArray([
    //   [2,  3, -1],
    //   [3,  2,  1],
    //   [1, -5,  3]
    // ]);
    // const matrixA = Matrix.fromArray([
    //   [3,  -0.1, -0.2],
    //   [0.1,  7,  -0.3],
    //   [0.3, -0.2,  10]
    // ]);
    // const matrixA = Matrix.fromArray([
    //   [25,  5, 1],
    //   [64,  8,  1],
    //   [144, 12,  1]
    // ]);

    // const matrixA = Matrix.fromArray([
    //   [-1, 2.5, 5],
    //   [-2,  9,  11],
    //   [4, -22,  -20]
    // ]);
    const matrixA = Matrix.fromArray([
      [4, 12, -16],
      [12, 37, -43],
      [-16, -43, 98],
    ]);
    //  let s = Doolittle.solve(matrixA, new Matrix(3,1));
    //  let s = Cholesky.solve(matrixA);
    //  let s = Crout.solve(matrixA);

    // for(let i of s[0]) {
    //   console.log(i.getMsg(), "\n", i.getMatrix()?.print());
    // }

    //
    // expect(L.getElement(0, 0)).toEqual(1);
    // expect(L.getElement(0, 1)).toEqual(0);
    // expect(L.getElement(0, 2)).toEqual(0);
    // expect(L.getElement(1, 0)).toEqual(1.5);
    // expect(L.getElement(1, 1)).toEqual(1);
    // expect(L.getElement(1, 2)).toEqual(0);
    // expect(L.getElement(2, 0)).toEqual(0.5);
    // expect(L.getElement(2, 1)).toEqual(2.6);
    // expect(L.getElement(2, 2)).toEqual(1);
  });
});
