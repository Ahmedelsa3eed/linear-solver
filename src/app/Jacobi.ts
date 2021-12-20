import { Matrix } from './Matrix';

export class Jacobi {
    A!: Matrix  //the coofeciant matrix
    B!: Matrix  //the result matrix
    intialGuess!: number[]
    es!: number
    imax!: number
    n!: number; //the number of rows (square matrix)

    constructor(A?: Matrix, B?: Matrix, intialGuess?: number[], es?: number, imax?: number) {
        if (A && B && intialGuess && es && imax) {
            this.SetMatrix(A)
            this.B = B.clone()
            this.intialGuess = intialGuess
            this.es = es
            this.imax = imax
        }
    }

    SetMatrix(M: Matrix) {
        if (M.getRows() != M.getCols()) {
            throw new Error("The matrix isn't square");
        }
        this.A = M.clone();
        this.n = M.getRows();
    }

    jacobi(): number[] {
        const x = []
        const ea = []
        let guess = this.intialGuess
        for (let k = 0; k < this.imax; k++) {

            for (let i = 0; i < this.n; i++) {
                x[i] = this.B.getElement(i, 0)
                for (let j = 0; j < this.n; j++) {
                    if (i != j) {
                        x[i] -= (this.A.getElement(i, j) * guess[j])
                    }
                }
                x[i] /= this.A.getElement(i, i)
                ea[i] = Math.abs((x[i] - guess[i]) / x[i])
            }

            for (let i = 0; i < x.length; i++)
                guess[i] = x[i]

            var max = ea[0]
            for (let i = 1; i < ea.length; i++)
                if (ea[i] > max) max = ea[i]

            if (max <= this.es) break

        }
        return x
    }

}
