import { parse, simplify, derivative, create, all } from 'mathjs'
import { Big } from 'src/app/shared/Big';
import { Status } from 'src/app/shared/Status.model';

const math = create(all);

export class FixedPoint {
    private readonly SFs: number
    
    constructor(SFs: number = 6) {
        this.SFs = SFs 
    }

    solve(
        fx: string,
        x0: number,
        imax: number = 50,
        es: number = 0.00001
    ): [string[], number, Status, any[], any[]] {
        let res;
        let k;
        let count: number = 0;
        while (count < 50) {
            k = Big.Precise(math.random(-1, -0.01), this.SFs);
            if(Math.abs(derivative(`${k} * (${fx}) + x`, 'x', {simplify: true}).evaluate({x: x0})) < 1) {
                res = this.solveG(`${k} * (${fx}) + x`, x0, imax, es);
                if(Math.abs(parse(fx).evaluate({x: res[1]})) < 0.02) {
                    return res;
                }
            }
            count++;
        }
        count = 0;
        while(count < 50){
            k = Big.Precise(math.random(0.01, 1), this.SFs);
            if(Math.abs(math.evaluate(math.derivative(`${k} * (${fx}) + x`, 'x', {simplify: true}).toString(), {x: x0})) < 1){
                res = this.solveG(`${k} * (${fx}) + x`, x0, imax, es);
                if (Math.abs(math.evaluate(fx, {x: res[1]})) < 0.05) {
                    return res;
                }
            }
            count++;
        }
        return this.solveG(fx + "+x", x0, imax, es);
    }
    private solveG(
        gx: string,
        x0: number,
        imax: number = 100,
        es: number = 0.00001
    ): [string[], number, Status, any[], any[]] {
        const g = math.parse(simplify(gx).toString());
        let xi = x0                //i'th guess
        const x: number[] = []    //to store the guess of each iteration
        const ea: number[] = []
        const steps: string[] = []
        const toBeDrawn = []
        const annots = []
        toBeDrawn.push(
            {
                graphType: 'polyline',
                fn: gx.split("e").join("" + Math.E),
                color: 'red'
            },
            {
                fn: "x",
                color: "green"
            }
        )
        
        let g_txt: string = simplify(gx).toTex().split("cdot").join("times");
        steps.push("$\\blacksquare$ Applying fixed point method:");
        steps.push(`$$g(x)= ${g_txt}$$`)
        steps.push("$$x_{i+1} = g(x_{i}) = " + g_txt.split("x").join(`x_{i}`) + "$$")
        for (let i = 0; i <= imax ; i++) {
            steps.push(`$\\bigstar$ Iteration ${i + 1}:`)
            
            const newXi = Big.Precise(math.evaluate(g.toString(), {x: Big.Precise(xi, this.SFs) }), this.SFs)
            
            steps.push(
                "$$x_r^{" + (i + 1) + "} = " + g_txt.split('x').join("" + Big.Precise(xi,this.SFs)) + " = " + newXi + "$$"
            );
            if (i == 0) {
                toBeDrawn.push(
                    {
                        fnType: 'points',
                        graphType: 'polyline',
                        points:[
                            [xi, 0],
                            [xi, newXi]
                        ],
                        color: "blue"     
                    },
                    {
                        fnType: 'points',
                        graphType: 'polyline',
                        points:[
                            [xi, newXi],
                            [newXi, newXi]
                        ],
                        color: "blue"
                    }
                )
            } else {
                toBeDrawn.push(
                    {
                        fnType: 'points',
                        graphType: 'polyline',
                        points:[
                            [xi, xi],
                            [xi, newXi]
                        ],
                        color:"blue"
                    },
                    {
                        fnType: 'points',
                        graphType: 'polyline',
                        points:[
                            [xi, newXi],
                            [newXi, newXi]
                        ],
                        color:"blue"
                    }
                )
            }
            annots.push({x: xi})
                
            ea[i] = Math.abs((newXi - xi)) / Math.abs(newXi)
            steps.push(`$$|\\epsilon_a| = |\\frac{x_${i + 1} - x_${i}}{x_${i + 1}}| = |\\frac{${newXi} - ${xi}}{${newXi}}| = ${ea[i]}$$`);

            xi = newXi
            x[i] = newXi

            if ((i > 0 && ea[i] > (ea[i-1] * 1.5)) || xi === Infinity || xi === -Infinity) {
                if (xi === Infinity) {
                    steps.push(`$\\because x_${i + 1} = \\infty$`)
                } else if (xi === -Infinity) {
                    steps.push(`$\\because x_${i + 1} = -\\infty$`)
                } else if (ea[i] > ea[i-1]) {
                    steps.push(`$\\because \\epsilon_a^${i + 1} > 1.5 \\times \\epsilon_a^${i}$`)
                }
                steps.push(`$\\therefore$ Solution diverges when using fixed point method.`)
                return [steps, xi, Status.DIVERGED, toBeDrawn, annots]
            }

            if (ea[i] === 0 || ea[i] < es || i >= imax) {
                if (ea[i] < es) {
                    steps.push(`$\\because |\\frac{x_${i + 1} - x_${i}}{x_${i + 1}}| = ${ea[i]} < \\epsilon_s$`)
                } else if (ea[i] === 0) {
                    steps.push(`$\\because |\\frac{x_${i + 1} - x_${i}}{x_${i + 1}}| = 0$`)
                } else {
                    steps.push(`$\\because$ Iterations Exhausted.`)
                    return [steps, xi, Status.MAX, toBeDrawn, annots];
                }
                steps.push(`$\\therefore x \\approx ${xi}$`)
                return [steps, xi, Status.CONVERGED, toBeDrawn, annots];
            }
        }
        return [steps, xi, Status.ERROR, toBeDrawn, annots]
    }
}
