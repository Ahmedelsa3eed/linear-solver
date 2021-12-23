import { LU } from "./LU";
import { Cholesky } from "./Cholesky";
import { Crout } from "./Crout";
import { Doolittle } from "./Doolittle";

export class LUFactory {
  protected precision: number;
  constructor(precision: number = 6) {
    this.precision = precision;
  }
  public getDecomposer(str: string): LU {
    if (str.toLocaleLowerCase() === "crout") {
      return new Crout(this.precision);
    } else if (str.toLocaleLowerCase() === "cholesky") {
      return new Cholesky(this.precision);
    } else if (str.toLocaleLowerCase() === "doolittle") {
      return new Doolittle(this.precision);
    } else {
      throw new Error(str + ` can't be recognised as a LU method`);
    }
  }
}
