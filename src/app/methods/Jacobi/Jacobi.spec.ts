import { TestBed } from "@angular/core/testing";
import { Jacobi } from "./Jacobi";
import { Matrix } from "../../shared/Matrix";

describe("Jacobi", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Jacobi],
    }).compileComponents();
  });

  it("using jacobi and the stoping condition is eps = 0.1", () => {
    const matrixA = Matrix.fromArray([
      [4, 2, 1],
      [-1, 2, 0],
      [2, 1, 4],
    ]);
    const matrixB = Matrix.fromArray([[11], [3], [16]]);
    const intialGuess = [1, 1, 1];

    const jacobi = new Jacobi(matrixA, matrixB, intialGuess, 0.1, 1000, 4);
    const x = jacobi.solve(matrixA, matrixB, intialGuess,["c","v","b"],0.1,1000);
    console.log(x[0]);

    expect(x[1].getElement(matrixA.getRows(), 0)).toBe(1.038);
    expect(x[1].getElement(matrixA.getRows(), 1)).toBe(1.938);
    expect(x[1].getElement(matrixA.getRows(), 2)).toBe(3.07);
  });

  it("using jacobi and the stoping condition is i = 5", () => {
    const matrixA = Matrix.fromArray([
      [4, 2, 1],
      [-1, 2, 0],
      [2, 1, 4],
    ]);
    const matrixB = Matrix.fromArray([[11], [3], [16]]);
    const intialGuess = [1, 1, 1];

    const jacobi = new Jacobi(matrixA, matrixB, intialGuess, 0, 5, 5);
    const x = jacobi.solve(matrixA,matrixB,intialGuess,['x','y','z'],0,5);
    console.log(x[0]);
    expect(x[1].getElement(matrixA.getRows(), 0)).toBe(1.039);
    expect(x[1].getElement(matrixA.getRows(), 1)).toBe(1.9375);
    expect(x[1].getElement(matrixA.getRows(), 2)).toBe(3.0703);
  });
});
