import { TestBed } from "@angular/core/testing";
import { Gauss } from "./Gauss";
import { Matrix } from "../../shared/Matrix";
describe("Gauss", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Gauss],
    }).compileComponents();
  });

  it("should solve using Gauss", () => {
    const matrixA = Matrix.fromArray([
      [4, 2, 1],
      [-1, 2, 0],
      [2, 1, 4],
    ]);
    const matrixB = Matrix.fromArray([[11], [3], [16]]);
    const gauss = new Gauss();

    const x = gauss.solve(matrixA, matrixB);
    console.log(x[0]);
    expect(matrixA.getElement(0, 0)).toEqual(4);
    expect(matrixA.getElement(0, 1)).toEqual(2);
    expect(matrixA.getElement(0, 2)).toEqual(1);

    expect(matrixA.getElement(1, 0)).toEqual(0);
    expect(matrixA.getElement(1, 1)).toEqual(2.5);
    expect(matrixA.getElement(1, 2)).toEqual(0.25);

    expect(matrixA.getElement(2, 0)).toEqual(0);
    expect(matrixA.getElement(2, 1)).toEqual(0);
    expect(matrixA.getElement(2, 2)).toEqual(3.5);

    expect(matrixB.getElement(0, 0)).toEqual(11);
    expect(matrixB.getElement(1, 0)).toEqual(5.75);
    expect(matrixB.getElement(2, 0)).toEqual(10.5);

    expect(x[1].getElement(0, 0)).toEqual(1);
    expect(x[1].getElement(1, 0)).toEqual(2);
    expect(x[1].getElement(2, 0)).toEqual(3);
  });
});
