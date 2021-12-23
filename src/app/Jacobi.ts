import { Matrix } from './Matrix';

export class Jacobi {
    A!: Matrix  //the coofeciant matrix
    B!: Matrix  //the result matrix
    intialGuess!: number[]
    es!: number
    imax!: number
    n!: number; //the number of rows (square matrix)

    constructor(
        A?: Matrix,
        B?: Matrix,
        intialGuess?: number[],
        es?: number,
        imax: number = 1000
    ) {
        if (A && B && intialGuess) {
            this.setMatrix(A)
            this.B = B.clone()
            this.intialGuess = intialGuess
            this.imax = imax
        }
        this.es = 0
        if (es) this.es = es
    }

    private setMatrix(M: Matrix) {
        if (M.getRows() != M.getCols()) {
            throw new Error("The matrix isn't square");
        }
        this.A = M.clone();
        this.n = M.getRows();
    }

    solve(): Matrix {
        console.log(this.showTheFormula())
        let x: number[][] = []
        const ea = []
        let guess = this.intialGuess
        for (let k = 0; k < this.imax; k++) {
            x[k] = []
            for (let i = 0; i < this.n; i++) {
                x[k][i] = this.B.getElement(i, 0)
                for (let j = 0; j < this.n; j++) {
                    if (i != j) {
                        x[k][i] -= (this.A.getElement(i, j) * guess[j])
                    }
                }
                x[k][i] /= this.A.getElement(i, i)
                ea[i] = Math.abs((x[k][i] - guess[i]) / x[k][i])
            }

            for (let i = 0; i < this.n; i++)
                guess[i] = x[k][i]

            var max = ea[0]
            for (let i = 1; i < ea.length; i++)
                if (ea[i] > max) max = ea[i]

            if (this.es != 0 && max < this.es) break

            if (this.imax > 1000) break

        }
        return Matrix.fromArray(x)
    }

    private showTheFormula(): string[] {
        const equations: string[] = []
        for (let i = 0; i < this.n; i++) {
            let st = ''
            st += 'x' + (i + 1) + ' = ('
            st += this.B.getElement(i, 0)
            for (let j = 0; j < this.n; j++) {
                if (i != j)
                    st += '-' + this.A.getElement(i, j) + 'x' + (j + 1)
            }
            st += ') / ' + this.A.getElement(i, i)
            equations[i] = st
        }
        return equations
    }

}
