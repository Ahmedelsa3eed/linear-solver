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

    it("solution should converge using Jacobi method", () => {
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

        const jacobi = new Jacobi(matrixA, matrixB, intialGuess, 0.1, 20)
        const x = jacobi.jacobi()
        expect(x[0]).toBeCloseTo(1.014, 4)
        expect(x[1]).toBeCloseTo(2.02, 4)
        expect(x[2]).toBeCloseTo(2.996, 4)
    });


});