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

    it("using gauss seidil and the stoping condition is eps = 0.1", () => {
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

        const seidel = new Seidil(matrixA, matrixB, intialGuess, 0.1)   //take eps only
        const x = seidel.gaussSeidil()
        expect(x.getElement(matrixA.getRows(), 0)).toBeCloseTo(1.009, 2)
        expect(x.getElement(matrixA.getRows(), 1)).toBeCloseTo(1.9995, 2)
        expect(x.getElement(matrixA.getRows(), 2)).toBeCloseTo(2.996, 2)
    });

    it("using gauss seidil and the stoping condition is i=6", () => {
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

        const seidel = new Seidil(matrixA, matrixB, intialGuess, 0, 6)     //when eps=0, we will ignore it
        const x = seidel.gaussSeidil()
        expect(x.getElement(matrixA.getRows(), 0)).toBeCloseTo(0.99919, 3)
        expect(x.getElement(matrixA.getRows(), 1)).toBeCloseTo(3.0001, 3)
        expect(x.getElement(matrixA.getRows(), 2)).toBeCloseTo(4.0001, 3)
    });

    it("using gauss seidil and the stoping condition is i=5", () => {
        const matrixA = Matrix.fromArray([
            [5, -2, 3],
            [-3, 9, 1],
            [2, -1, -7]
        ]);
        const matrixB = Matrix.fromArray([
            [-1],
            [2],
            [3]
        ]);
        const intialGuess = [0, 0, 0]

        const seidel = new Seidil(matrixA, matrixB, intialGuess, 0, 5)     //take # iterations only
        const x = seidel.gaussSeidil()
        expect(x.getElement(matrixA.getRows(), 0)).toBeCloseTo(0.186, 3)
        expect(x.getElement(matrixA.getRows(), 1)).toBeCloseTo(0.331, 3)
        expect(x.getElement(matrixA.getRows(), 2)).toBeCloseTo(-0.423, 3)
    });



});