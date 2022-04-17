import * as math from 'mathjs'
import { derivative, parse, evaluate, abs, simplify } from 'mathjs'
import { Big } from 'src/app/shared/Big'
import { Status } from 'src/app/shared/Status.model'

export class NewtonRaphson {
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
        const f = parse(simplify(fx).toString())
        const fDash = derivative(f, 'x')
        const steps: string[] = []
        let xi = x0                 // initial guess
        let x: number = 0           // store the result of each iteration
        const ea: number[] = []     // to check the error for each iteraion
        const toBeDrawn = []      
        const annotations = []
        annotations.push({x: x0})
        toBeDrawn.push({
            fn: fx.split("e").join("" + Big.Precise(math.e, this.SFs)),
            color: "blue",
            graphType: "polyline"
        });
        steps.push("$\\blacksquare$ Applying Newton Raphson method:");
        let f_txt: string = simplify(fx).toTex().split("cdot").join("times");
        let fdash_txt: string = simplify(fDash).toTex().split("cdot").join("times");
        steps.push(`$$f(x) = ${f_txt}$$`);
        steps.push(`$$f'(x) = ${fdash_txt}$$`);
        steps.push(`$$x_{i+1} = x_i - \\frac{f(x_i)}{f'(x_i)}$$`);
        steps.push(`$$x_{i+1} = x_i - \\frac{${f_txt.split("x").join(`x_{i}`)}}{${fdash_txt.split("x").join(`x_{i}`)}}$$`);
        
        for (let i = 0; i <= imax; i++) {
            steps.push(`$\\bigstar$ Iteration ${i + 1}:`)

            const numerator = evaluate(f.toString(), { x: xi });
            const denominator = evaluate(fDash.toString(), { x: xi });
            
            x = new Big(xi, this.SFs).sub(new Big(numerator, this.SFs).div(denominator)).getValue();

            const sumString: string =
                Big.Precise(xi, this.SFs) +
                "-" +
                "\\frac{" +
                Big.Precise(numerator, this.SFs) +
                "}{" +
                Big.Precise(denominator, this.SFs) +
                "}";

            steps.push(`$$x_${i + 1} = x_${i} - \\frac{f(x_${i})}{f'(x_${i})} = ${sumString} = ${x}$$`);

            toBeDrawn.push({
                points: [
                    [xi, 0],
                    [xi, Big.Precise(numerator, this.SFs)]
                ],
                fnType: "points",
                graphType: "polyline",
                color: "red"
            });
            toBeDrawn.push({
                points: [
                    [xi, Big.Precise(numerator, this.SFs)],
                    [x, 0]
                ],
                fnType: "points",
                graphType: "polyline",
                color: "red"
            });
            annotations.push({x: x});

            ea[i] = abs((x - xi) / x);
            steps.push(`$$|\\epsilon_a| = |\\frac{x_${i + 1} - x_${i}}{x_${i + 1}}| = |\\frac{${x} - ${xi}}{${x}}| = ${ea[i]}$$`);
            xi = x;

            if (ea[i] === 0 || ea[i] < es || i >= imax) {
                if (ea[i] < es) {
                    steps.push(`$\\because |\\frac{x_${i + 1} - x_${i}}{x_${i + 1}}| = ${ea[i]} < \\epsilon_s$`)
                } else if (ea[i] === 0) {
                    steps.push(`$\\because |\\frac{x_${i + 1} - x_${i}}{x_${i + 1}}| = 0$`)
                } else {
                    steps.push(`$\\because$ Iterations Exhausted.`)
                    return [steps, xi, Status.MAX, toBeDrawn, annotations];
                }
                steps.push(`$\\therefore x \\approx ${xi}$`)
                return [steps, xi, Status.CONVERGED, toBeDrawn, annotations];
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
                return [steps, xi, Status.DIVERGED, toBeDrawn, annotations]
            }
        }
        return [steps, x, Status.ERROR, toBeDrawn, annotations];
    }
}