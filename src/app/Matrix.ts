export class Matrix {
    private rows: number;
    private cols: number;
    private data: number[][];
    constructor(rows: number, cols: number) {
        this.rows = rows;
        this.cols = cols;
        this.data = [];
        for (let i = 0; i < rows; i++) {
            this.data[i] = [];
            for (let j = 0; j < cols; j++) {
                this.data[i][j] = 0;
            }
        }
    }
    static fromArray(arr: number[][]): Matrix {
        let result = new Matrix(arr.length, arr[0].length);
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[i].length; j++) {
                result.setElement(i, j, arr[i][j]);
            }
        }
        return result;
    }
    getElement(row: number, col: number): number {
        return this.data[row][col];
    }
    setElement(row: number, col: number, value: number): void {
        this.data[row][col] = value;
    }
    getRows(): number {
        return this.rows;
    }
    getCols(): number {
        return this.cols;
    }
    add(m: Matrix): Matrix {
        if (this.rows !== m.rows || this.cols !== m.cols) {
            throw new Error("Matrix sizes do not match");
        }
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] = this.data[i][j] + m.data[i][j];
            }
        }
        return this;
    }
    subtract(m: Matrix): Matrix {
        if (this.rows !== m.rows || this.cols !== m.cols) {
            throw new Error("Matrix sizes do not match");
        }
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] = this.data[i][j] - m.data[i][j];
            }
        }
        return this;
    }
    multiply(m: Matrix): Matrix {
        if (this.cols !== m.rows) {
            throw new Error("Matrix sizes do not match");
        }
        const thisClone = this.clone();
        this.cols = m.cols;
        this.data = [];
        for (let i = 0; i < thisClone.rows; i++) this.data[i] = [];
        for (let i = 0; i < thisClone.rows; i++) {
            for (let j = 0; j < m.cols; j++) {
                let sum = 0;
                for (let k = 0; k < thisClone.cols; k++) {
                    sum += thisClone.data[i][k] * m.data[k][j];
                }
                this.data[i][j] = sum;
            }
        }
        return this;
    }
    multiplyByScalar(scalar: number): Matrix {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] *= scalar;
            }
        }
        return this;
    }
    exchangeRows(row1: number, row2: number): Matrix {
        let temp = this.data[row1];
        this.data[row1] = this.data[row2];
        this.data[row2] = temp;
        return this;
    }
    multiplyRowByScalar(row: number, scalar: number): Matrix {
        for (let i = 0; i < this.cols; i++) {
            this.data[row][i] *= scalar;
        }
        return this;
    }
    addRowToAnother(row1: number, row2: number): Matrix {
        for (let i = 0; i < this.cols; i++) {
            this.data[row1][i] += this.data[row2][i];
        }
        return this;
    }
    print(): string {
        let result = "";
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const separator = j === this.cols - 1 ? "" : " ";
                result += this.data[i][j] + separator;
            }
            result += "\n";
        }
        return result;
    }
    clone(): Matrix {
        let result = new Matrix(this.rows, this.cols);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                result.data[i][j] = this.data[i][j];
            }
        }
        return result;
    }
}