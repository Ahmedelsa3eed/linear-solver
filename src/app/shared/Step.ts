import { Matrix } from './Matrix';

export class Step {
  private msg: string;
  constructor(msg: string, m: Matrix | null) {
    this.msg = msg;
    if (m) {
      this.msg += "$$" + m.printLatex() + "$$";
    }
  }
  getMsg() {
    return this.msg;
  }
}
