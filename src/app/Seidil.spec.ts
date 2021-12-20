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
            [12, 3, -5],
            [1, 5, 3],
            [3, 7, 13]
        ]);
        const matrixB = Matrix.fromArray([
            [1],
            [28],
            [76]
        ]);
        const intialGuess = [1, 0, 1]

        const seidel = new Seidil(matrixA, matrixB, intialGuess, 0.0001, 3)
        const x = seidel.gaussSeidil()
        expect(x[0]).toBeCloseTo(0.99919, 5)
        expect(x[1]).toBeCloseTo(3.0001, 5)
        expect(x[2]).toBeCloseTo(4.0001, 5)
    });


});