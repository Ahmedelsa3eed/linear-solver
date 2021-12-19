import { Matrix } from "./Matrix";

export class step{
    msg:string;
    m:Matrix;
    constructor(msg:string,m:Matrix){
        this.msg=msg;
        this.m=m.clone();
    }
    getMsg(){
        return this.msg;
    }
    getMatrix(){
        return this.m;
    }
}