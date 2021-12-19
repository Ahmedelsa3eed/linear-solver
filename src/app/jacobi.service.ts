import { Injectable } from '@angular/core';
import { Matrix } from './Matrix';

@Injectable({
  providedIn: 'root'
})
export class JacobiService {
  matrix = [
    [12, 3, -5],
    [1, 5, 3],
    [3, 7, 13]]
  A = Matrix.fromArray(this.matrix)
  b = [1, 28, 76]
  intialGuess: number[] = [1, 0, 1]
  imax = 50
  es = 0.0001

  constructor() { }

  jacobi() {
    const x = []
    const ea = []
    let guess = this.intialGuess
    for (let k = 0; k < this.imax; k++) {

      for (let i = 0; i < this.A.getRows(); i++) {
        x[i] = this.b[i]
        for (let j = 0; j < this.A.getCols(); j++) {
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

      if (max < this.es) break

    }
  }

}
