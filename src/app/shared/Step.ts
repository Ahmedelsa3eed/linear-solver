import { Matrix } from './Matrix';

export class Step {
  msg: string;
  m: Matrix | null;
  constructor(msg: string, m: Matrix | null) {
    this.msg = msg;
    this.m = null;
    if (m) {
      this.m = m.clone();
    }
  }
  getMsg() {
    return this.msg;
  }
  getMatrix() {
    return this.m;
  }
}
