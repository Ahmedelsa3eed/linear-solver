import { TestBed } from '@angular/core/testing';
import { GaussJordan } from './GaussJordan';
import { Matrix } from './Matrix';
describe('GaussJordan', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GaussJordan],
    }).compileComponents();
  });

  it('should solve using GaussJordan', () => {
    const matrixA = Matrix.fromArray([
      [4, 2, 1],
      [-1, 2, 0],
      [2, 1, 4],
    ]);
    const matrixB = Matrix.fromArray([[11], [3], [16]]);
    const gaussJordan = new GaussJordan();
    const x = gaussJordan.solve(matrixA, matrixB);

    expect(matrixA.getElement(0, 0)).toEqual(1);
    expect(matrixA.getElement(0, 1)).toEqual(0);
    expect(matrixA.getElement(0, 2)).toEqual(0);

    expect(matrixA.getElement(1, 0)).toEqual(0);
    expect(matrixA.getElement(1, 1)).toEqual(1);
    expect(matrixA.getElement(1, 2)).toEqual(0);

    expect(matrixA.getElement(2, 0)).toEqual(0);
    expect(matrixA.getElement(2, 1)).toEqual(0);
    expect(matrixA.getElement(2, 2)).toEqual(1);

    expect(x.getElement(0, 0)).toEqual(1);
    expect(x.getElement(1, 0)).toEqual(2);
    expect(x.getElement(2, 0)).toEqual(3);
  });
});
