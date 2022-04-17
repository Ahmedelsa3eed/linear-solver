import { parse, evaluate, abs, simplify } from 'mathjs'
import { Big } from 'src/app/shared/Big'
import { Status } from 'src/app/shared/Status.model'
  
  export class Seacant {
    private readonly SFs: number
    constructor(SFs: number = 6) {
        this.SFs = SFs
    }

    solve(
        fx: string,
        x0: number,
        x1:number,
        imax: number = 50,
        es: number = 0.00001
    ): [string[], number, Status, any[], any[]] {
        const f = parse(simplify(fx).toString())
        const steps: string[] = []
        let xi0 = Big.Precise(x1, this.SFs)
        const xi1 = Big.Precise(x0, this.SFs)
        let x: number = 0
        const ea: number[] = []
        const toBeDrawn: any[] = []
        const annots: any[] = []
        let f_txt: string = simplify(fx).toTex().split("cdot").join("times");
        steps.push("$\\blacksquare$ Applying Secants method:");
        steps.push(`$$f(x) = ${f_txt}$$`);
        steps.push(`$$x_{i+1} = x_i - f(x_{i}) \\times \\frac{x_i - x_{i-1}}{f(x_{i}) - f(x_{i-1})}$$`);
        steps.push(`$$x_{i+1} = x_i - ${f_txt.split("x").join(`x_{i}`)} \\times \\frac{x_i - x_{i-1}}{${f_txt.split("x").join(`x_{i}`)} - ${f_txt.split("x").join(`x_{i-1}`)}}$$`);
        toBeDrawn.push(
            {
                graphType: 'polyline',
                fn: f.toString().split("e").join("" + Math.E),
                color: 'orange',    
            }
        )

        let fxi0 = Big.Precise( evaluate(f.toString(), { x: xi0 }),this.SFs)
        let fxOld = fxi0
        const fxi1 = Big.Precise( evaluate(f.toString(), { x: xi1 }),this.SFs)
        annots.push(
            {x: xi1}
        )
        for (let i = 0; i <= imax; i++) {
            
            steps.push(`$\\bigstar$ Iteration ${i + 1}:`)
            
            annots.push(
                {x:xi0, Text:`iteration : ${i+1}`}
            )
            
            const numerator = new Big ( evaluate(f.toString(), { x: xi0 }) , this.SFs ).mul( new Big ( xi0,this.SFs).sub( new Big(xi1,this.SFs ))).getValue();
            const denomenator = new Big ( evaluate(f.toString(), { x: xi0 }) , this.SFs ).sub(  new Big ( evaluate(f.toString(), { x: xi1 }) , this.SFs) ).getValue();
            
            x = new Big(xi0, this.SFs).sub(new Big(numerator, this.SFs).div(denomenator)).getValue()
            
            const fxnew=Big.Precise( evaluate(f.toString(), { x: x }),this.SFs)
            
            steps.push(`$$x_${i + 2} = x_${i+1} - f(x_{${i+1}}) \\times \\frac{x_${i+1} - x_{${i}}}{f(x_{${i+1}}) - f(x_{${i}})}$$`);
            steps.push(`$$x_${i + 2} = ${Big.Precise(xi0, this.SFs)} - (${Big.Precise( evaluate(f.toString(), { x: xi0 }),this.SFs)}) \\times \\frac{${Big.Precise(xi0,this.SFs)} - (${Big.Precise(xi1,this.SFs)})}{${Big.Precise(evaluate(f.toString(), { x: xi0 }),this.SFs)} - (${Big.Precise(evaluate(f.toString(), { x: xi1 }),this.SFs)})} = ${x}$$`);
            
            ea[i] = abs((x - xi0) / x)
            steps.push(`$$|\\epsilon_a| = |\\frac{x_${i + 2} - x_${i + 1}}{x_${i + 2}}| = |\\frac{${x} - ${xi0}}{${x}}| = ${ea[i]}$$`);
            
            toBeDrawn.push(
                {
                    fnType: 'points',
                    graphType: 'polyline',
                    points:[
                        [xi0, fxOld],
                        [xi1, fxi1]
                    ],
                    color:"rgb(230,0,0,0.4)"     
                },
                {
                    fnType: 'points',
                    graphType: 'polyline',
                    points:[
                        [x, 0],
                        [x, fxnew]
                    ],
                    color:"rgb(0,0,100,0.5)"
                },
                
            )
            fxOld = fxnew;
            xi0 = x

            if (ea[i] === 0 || ea[i] < es || i >= imax) {
                if (ea[i] < es) {
                    steps.push(`$\\because |\\frac{x_${i + 1} - x_${i}}{x_${i + 1}}| = ${ea[i]} < \\epsilon_s$`)
                } else if (ea[i] === 0) {
                    steps.push(`$\\because |\\frac{x_${i + 1} - x_${i}}{x_${i + 1}}| = 0$`)
                } else {
                    steps.push(`$\\because$ Iterations Exhausted.`)
                    return [steps, x, Status.MAX, toBeDrawn, annots];
                }
                steps.push(`$\\therefore x \\approx ${x}$`)
                return [steps, x, Status.CONVERGED, toBeDrawn, annots];
            }

            if ((i > 0 && ea[i] > (ea[i-1] * 1.5)) || x === Infinity || x === -Infinity) {
                if (x === Infinity) {
                    steps.push(`$\\because x_${i + 1} = \\infty$`)
                } else if (x === -Infinity) {
                    steps.push(`$\\because x${i + 1} = -\\infty$`)
                } else if (ea[i] > ea[i-1]) {
                    steps.push(`$\\because \\epsilon_a^${i + 1} > 1.5 \\times \\epsilon_a^${i}$`)
                }
                steps.push(`$\\therefore$ Solution diverges when using Newton Raphson method.$`)
                return [steps, x, Status.DIVERGED, toBeDrawn, annots]
            }

        }
        return [steps, x, Status.MAX,toBeDrawn,annots]
    }
}
