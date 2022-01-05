import { Matrix } from './Matrix';

export class Step {
  private msg: string;
  constructor(msg: string, m: Matrix | null,b?:Matrix) {
    this.msg = msg;
    if (m) {
      this.msg += "$$" + m.printLatex();
    }
    if(b){
      this.msg += b.printLatex() + "$$";
    }
    else if(m){
      this.msg+="$$";
    }
  }
  getMsg() {
    return this.msg;
  }
}
