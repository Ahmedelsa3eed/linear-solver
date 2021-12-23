import { TestBed } from "@angular/core/testing";
import { LU } from "./LU";
import { LUFactory } from "./LUFactory";
import { Matrix } from "../../shared/Matrix";

describe("LU", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LU, LUFactory],
    }).compileComponents();
  });
  it("should [crout/doolittle] decompose a Matrix 3*3", () => {
    const matrixA = Matrix.fromArray([
      [2, 3, -1],
      [3, 2, 1],
      [1, -5, 3],
    ]);
    const LUFac = new LUFactory();
    var LU;
    for (let i = 0; i < 1; i++) {
      LU = LUFac.getDecomposer(["crout", "doolittle"][i]);
      let res = LU.Decompose(matrixA);
      let L = res[0];
      let U = res[1];
      //L:
      expect(L.getElement(0, 0)).toEqual(2);
      expect(L.getElement(0, 1)).toEqual(0);
      expect(L.getElement(0, 2)).toEqual(0);
      expect(L.getElement(1, 0)).toEqual(3);
      expect(L.getElement(1, 1)).toEqual(-5 / 2);
      expect(L.getElement(1, 2)).toEqual(0);
      expect(L.getElement(2, 0)).toEqual(1);
      expect(L.getElement(2, 1)).toEqual(-13 / 2);
      expect(L.getElement(2, 2)).toEqual(-3);
      //U:
      expect(U.getElement(0, 0)).toEqual(1);
      expect(U.getElement(0, 1)).toEqual(3 / 2);
      expect(U.getElement(0, 2)).toEqual(-1 / 2);
      expect(U.getElement(1, 0)).toEqual(0);
      expect(U.getElement(1, 1)).toEqual(1);
      expect(U.getElement(1, 2)).toEqual(-1);
      expect(U.getElement(2, 0)).toEqual(0);
      expect(U.getElement(2, 1)).toEqual(0);
      expect(U.getElement(2, 2)).toEqual(1);
    }
  });
  it("should cholesky-decompose a positive definite Matrix 3*3", () => {
    const matrixA = Matrix.fromArray([
      [4, 12, -16],
      [12, 37, -43],
      [-16, -43, 98],
    ]);
    const LUFac = new LUFactory();
    const LU = LUFac.getDecomposer("cholesky");
    const res = LU.Decompose(matrixA);
    const L = res[0];
    const U = res[1];
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
  it("should solve a Matrix 3*3 using LU", () => {
    const matrixA = Matrix.fromArray([
      [2, 3, -1],
      [3, 2, 1],
      [1, -5, 3],
    ]);
    const LUFac = new LUFactory();
    const lu = LUFac.getDecomposer("crout");
    const res = lu.Decompose(matrixA);
    const L = res[0];
    const U = res[1];
    const b = Matrix.fromArray([[5], [10], [0]]);
    const x = new LU().Solve(L, U, b); //static method

    expect((x as Matrix).getElement(0, 0)).toEqual(1);
    expect((x as Matrix).getElement(1, 0)).toEqual(2);
    expect((x as Matrix).getElement(2, 0)).toEqual(3);
  });
});
