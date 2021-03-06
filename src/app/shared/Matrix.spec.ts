import { TestBed } from '@angular/core/testing';
import { Matrix } from './Matrix';

describe('Matrix', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Matrix],
    }).compileComponents();
  });

  it('should create 3x3 matrix', () => {
    const matrix = new Matrix(3, 3);
    expect(matrix).toBeInstanceOf(Matrix);
  });

  it('should print 3x3 matrix', () => {
    const matrix = new Matrix(3, 3);
    expect(matrix.print()).toBe('0 0 0\n0 0 0\n0 0 0\n');
  });

  it('should initialize 3x3 matrix with zeros', () => {
    const matrix = new Matrix(3, 3);
    expect(matrix.getElement(0, 0)).toEqual(0);
    expect(matrix.getElement(0, 1)).toEqual(0);
    expect(matrix.getElement(0, 2)).toEqual(0);
    expect(matrix.getElement(1, 0)).toEqual(0);
    expect(matrix.getElement(1, 1)).toEqual(0);
    expect(matrix.getElement(1, 2)).toEqual(0);
    expect(matrix.getElement(2, 0)).toEqual(0);
    expect(matrix.getElement(2, 1)).toEqual(0);
    expect(matrix.getElement(2, 2)).toEqual(0);
  });

  it('should multiply 3x3 matrix by 3x2 matrix', () => {
    const matrixA = Matrix.fromArray([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]);
    const matrixB = Matrix.fromArray([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
    matrixA.multiply(matrixB);
    expect(matrixA.getElement(0, 0)).toEqual(22);
    expect(matrixA.getElement(0, 1)).toEqual(28);
    expect(matrixA.getElement(1, 0)).toEqual(49);
    expect(matrixA.getElement(1, 1)).toEqual(64);
    expect(matrixA.getElement(2, 0)).toEqual(76);
    expect(matrixA.getElement(2, 1)).toEqual(100);
    expect(matrixA.getRows()).toEqual(3);
    expect(matrixA.getCols()).toEqual(2);
  });
  it('should transpose a 3x3 matrix ', () => {
    const matrixA = Matrix.fromArray([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]);
    const matrix = matrixA.transpose();
    expect(matrix.getElement(0, 0)).toEqual(1);
    expect(matrix.getElement(0, 1)).toEqual(4);
    expect(matrix.getElement(0, 2)).toEqual(7);
    expect(matrix.getElement(1, 0)).toEqual(2);
    expect(matrix.getElement(1, 1)).toEqual(5);
    expect(matrix.getElement(1, 2)).toEqual(8);
    expect(matrix.getElement(2, 0)).toEqual(3);
    expect(matrix.getElement(2, 1)).toEqual(6);
    expect(matrix.getElement(2, 2)).toEqual(9);
  });
  it('should check if a 3x3 matrix is symmetric', () => {
    const matrixA = Matrix.fromArray([
      [1, 2, 3],
      [2, 5, 6],
      [3, 6, 9],
    ]);
    expect(matrixA.isSym()).toEqual(true);
  });
  it('should check if a 3x3 matrix is positive definite', () => {
    const matrixA = Matrix.fromArray([
      [1, 2, 3],
      [2, 5, 6],
      [3, 6, 9],
    ]);
    expect(matrixA.isPosDef()).toEqual(true);
  });
});
