import { derivative, parse, evaluate, max, abs } from 'mathjs'
import { Big } from 'src/app/shared/Big'
import { Status } from 'src/app/shared/Status.model'

export class NewtonRaphson {

    SFs!: number    //default significant figures is the system default

    constructor(SFs: number = 6) { this.SFs = SFs }

    solve(fx: string, x0: number, imax: number = 50, EPS: number = 0.00001): [string[], number, Status] {
        let f = parse(fx)
        let fDash = derivative(f, 'x')
        let steps: string[] = []
        let xi = x0             //initial guess
        let x: number = 0       //store the result of each iteration
        let ea: number[] = []   //to check the error for each iteraion

        for (let i = 0; i < imax; i++) {
            steps.push("$----------------------$")

            var num = evaluate(f.toString(), { x: xi })
            var den = evaluate(fDash.toString(), { x: xi })

            //x(i+1) = xi - (f(xi) / f`(xi))
            x = new Big(xi, this.SFs).sub(
                new Big(num, this.SFs).div(den)).getValue()

            var Sum: string = Big.Precise(xi, this.SFs) + "-"
                + '\\frac{' + Big.Precise(num, this.SFs) + '}{'
                + Big.Precise(den, this.SFs) + '}'

            steps.push("$x_{" + i + "} = " + Sum + " = " + x + "$")

            ea[i] = abs((x - xi) / x)
            xi = x

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