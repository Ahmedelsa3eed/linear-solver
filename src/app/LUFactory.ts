import { LU } from "./LU";
import { Cholesky } from "./Cholesky";
import { Crout } from "./Crout";
import { Doolittle } from "./Doolittle";

export class LUFactory {
  public getDecomposer(str: string): LU {
    if (str.toLocaleLowerCase() === "crout") {
      return new Crout();
    } else if (str.toLocaleLowerCase() === "cholesky") {
      return new Cholesky();
    } else if (str.toLocaleLowerCase() === "doolittle") {
      return new Doolittle();
    } else {
      throw new Error(str + ` can't be recognised as a LU method`);
    }
  }
}
