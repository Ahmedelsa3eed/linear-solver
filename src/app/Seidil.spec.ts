import { TestBed } from '@angular/core/testing';
import { Seidil } from './Seidil';
import { Matrix } from './Matrix';

describe('Seidil', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                Seidil
            ],
        }).compileComponents();
    });

    it("solution should converge using gauss seidil", () => {
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

        const seidel = new Seidil(matrixA, matrixB, intialGuess, 0.1, 20)
        const x = seidel.gaussSeidil()
        expect(x[0]).toBeCloseTo(1.009, 3)
        expect(x[1]).toBeCloseTo(1.9995, 3)
        expect(x[2]).toBeCloseTo(2.996, 3)
    });


});