import { TestBed } from "@angular/core/testing";
import { Seidil } from "./Seidil";
import { Matrix } from "../../shared/Matrix";

describe("Seidil", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Seidil],
    }).compileComponents();
  });

  it("using gauss seidil and the stoping condition is eps = 0.1", () => {
    const matrixA = Matrix.fromArray([
      [4, 2, 1],
      [-1, 2, 0],
      [2, 1, 4],
    ]);
    const matrixB = Matrix.fromArray([[11], [3], [16]]);
    const intialGuess = [1, 1, 1];

    const seidel = new Seidil(matrixA, matrixB, intialGuess, 0.1, 1000, 4); //take eps only
    const x = seidel.solve();
    expect(x[1].getElement(matrixA.getRows(), 0)).toBe(0.9992);
    expect(x[1].getElement(matrixA.getRows(), 1)).toBe(2);
    expect(x[1].getElement(matrixA.getRows(), 2)).toBe(3);
  });

  it("using gauss seidil and the stoping condition is i=6", () => {
    const matrixA = Matrix.fromArray([
      [12, 3, -5],
      [1, 5, 3],
      [3, 7, 13],
    ]);
    const matrixB = Matrix.fromArray([[1], [28], [76]]);
    const intialGuess = [1, 0, 1];

    const seidel = new Seidil(matrixA, matrixB, intialGuess, 0, 6, 4); //when eps=0, we will ignore it
    const x = seidel.solve();
    expect(x[1].getElement(matrixA.getRows(), 0)).toBe(0.9475);
    expect(x[1].getElement(matrixA.getRows(), 1)).toBe(3.028);
    expect(x[1].getElement(matrixA.getRows(), 2)).toBe(3.997);
  });

  it("using gauss seidil and the stoping condition is i=5", () => {
    const matrixA = Matrix.fromArray([
      [5, -2, 3],
      [-3, 9, 1],
      [2, -1, -7],
    ]);
    const matrixB = Matrix.fromArray([[-1], [2], [3]]);
    const intialGuess = [0, 0, 0];

    const seidel = new Seidil(matrixA, matrixB, intialGuess, 0, 5, 4); //take # iterations only
    const x = seidel.solve();
    expect(x[1].getElement(matrixA.getRows(), 0)).toBe(0.1864);
    expect(x[1].getElement(matrixA.getRows(), 1)).toBe(0.3312);
    expect(x[1].getElement(matrixA.getRows(), 2)).toBe(-0.4226);
  });
});
