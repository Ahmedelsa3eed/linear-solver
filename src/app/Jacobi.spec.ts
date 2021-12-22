import { TestBed } from '@angular/core/testing';
import { Jacobi } from './Jacobi';
import { Matrix } from './Matrix';

describe('Jacobi', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                Jacobi
            ],
        }).compileComponents();
    });

    it("using jacobi and the stoping condition is eps = 0.1", () => {
        const matrixA = Matrix.fromArray([
            [4, 2, 1],
            [-1, 2, 0],
            [2, 1, 4]
        ]);
        const matrixB = Matrix.fromArray([
            [11],
            [3],
            [16]
        ]);
        const intialGuess = [1, 1, 1]

        const jacobi = new Jacobi(matrixA, matrixB, intialGuess, 0.1)
        const x = jacobi.jacobi()
        console.log(x)
        expect(x.getElement(matrixA.getRows(), 0)).toBeCloseTo(1.014, 2)
        expect(x.getElement(matrixA.getRows(), 1)).toBeCloseTo(2.02, 2)
        expect(x.getElement(matrixA.getRows(), 2)).toBeCloseTo(2.996, 2)
    });

    it("using jacobi and the stoping condition is i = 5", () => {
        const matrixA = Matrix.fromArray([
            [4, 2, 1],
            [-1, 2, 0],
            [2, 1, 4]
        ]);
        const matrixB = Matrix.fromArray([
            [11],
            [3],
            [16]
        ]);
        const intialGuess = [1, 1, 1]

        const jacobi = new Jacobi(matrixA, matrixB, intialGuess, 0, 5)
        const x = jacobi.jacobi()
        console.log(x)
        expect(x.getElement(matrixA.getRows(), 0)).toBeCloseTo(1.014, 2)
        expect(x.getElement(matrixA.getRows(), 1)).toBeCloseTo(2.02, 2)
        expect(x.getElement(matrixA.getRows(), 2)).toBeCloseTo(2.996, 2)
    });



});