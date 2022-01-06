import { derivative, parse, evaluate, max, abs } from 'mathjs'
import { Big } from 'src/app/shared/Big'
import { Status } from 'src/app/shared/Status.model'

export class Seacant {

    SFs!: number    //default significant figures is the system default

    constructor(SFs: number = 6) { this.SFs = SFs }

    solve(fx: string, x0: number,x1:number, imax: number = 50, EPS: number = 0.00001): [string[], number, Status] {

        let f = parse(fx)
        let steps: string[] = []
        let xi0 = x0
        let xi1 =  x1           //initial guess
        let x: number = 0       //store the result of each iteration
        let ea: number[] = []   //to check the error for each iteraion

        for (let i = 0; i < imax; i++) {

            steps.push("$----------------------$")

            var num = new Big ( evaluate(f.toString(), { x: xi0 }) , this.SFs ).mul( new Big ( xi0,this.SFs).sub( new Big(xi1,this.SFs ))).getValue();

            var den = new Big ( evaluate(f.toString(), { x: xi0 }) , this.SFs ).sub(  new Big ( evaluate(f.toString(), { x: xi1 }) , this.SFs) ).getValue();
            
            console.log("xi-1 = " + xi0 + "\n xi = " +xi1 + "\n" )
            //x(i+1) = xi - (f(xi) / f`(xi))

            x = new Big(xi0, this.SFs).sub(

                new Big(num, this.SFs).div(den)).getValue()
            
            console.log("xi+1 = " + x )
 
            var Sum: string = Big.Precise(xi0, this.SFs) + "-"
                + '\\frac{' + Big.Precise(num, this.SFs) + '}{'
                + Big.Precise(den, this.SFs) + '}'

            steps.push("$x_{" + i + "} = " + Sum + " = " + x + "$")

            ea[i] = abs((x - xi1) / x)
            
            xi0 = x

            if (max(ea) < EPS || i === 50)
                break

            if (i === 50) 
                return [steps, x, Status.MAX]
            
            if (i > 8) {
                if (ea[i] / max(ea.slice(0, -2)) > 1.25) 
                    return [steps, x, Status.DIVERGED]
            }

        }
        return [steps, x, Status.CONVERGED]
    }
}