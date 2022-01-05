import { TestBed } from "@angular/core/testing";
import { GaussJordan } from "./GaussJordan";
import { Matrix } from "../../shared/Matrix";
describe("GaussJordan", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GaussJordan],
    }).compileComponents();
  });

  it("should solve using GaussJordan", () => {
    const matrixA = Matrix.fromArray([
      [4, 2, 1],
      [-1, 2, 0],
      [2, 1, 4],
    ]);
    const matrixB = Matrix.fromArray([[11], [3], [16]]);
    const gaussJordan = new GaussJordan();
    let x=gaussJordan.solve(matrixA, matrixB);
    console.log(x[0])
    expect(matrixA.getElement(0, 0)).toEqual(1);
    expect(matrixA.getElement(0, 1)).toEqual(0);
    expect(matrixA.getElement(0, 2)).toEqual(0);

    expect(matrixA.getElement(1, 0)).toEqual(0);
    expect(matrixA.getElement(1, 1)).toEqual(1);
    expect(matrixA.getElement(1, 2)).toEqual(0);

    expect(matrixA.getElement(2, 0)).toEqual(0);
    expect(matrixA.getElement(2, 1)).toEqual(0);
    expect(matrixA.getElement(2, 2)).toEqual(1);

    expect(matrixB.getElement(0, 0)).toEqual(1);
    expect(matrixB.getElement(1, 0)).toEqual(2);
    expect(matrixB.getElement(2, 0)).toEqual(3);
  });
});
