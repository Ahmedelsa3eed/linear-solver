import * as math from "mathjs";
import { simplify } from "mathjs"
import { Big } from "src/app/shared/Big";
import { Status } from "src/app/shared/Status.model";

export class Bisection{
    private readonly SFs: number
    constructor(sfs: number) {
        this.SFs = sfs;
    }
    solve(
        fx: string,
        xll: number,
        xuu: number,
        imax: number = 50,
        EPS: number = 0.00001
    ): [string[], number, Status, any[], any[]] {
        const SFs = this.SFs
        let xu = Big.Precise(xuu, SFs);
        let xl = Big.Precise(xll, SFs);
        const steps : string[] = [];
        const toBeDrawn: any[] = [];
        const annots: any[] = [];
        steps.push("$\\blacksquare$ Applying bisection method:");
        const f_txt: string = simplify(fx).toTex().split("cdot").join("times");
        steps.push("$$f(x) = " + f_txt + "$$");
        steps.push("$\\bigstar$ Setting lower and upper gueses:");
        let fxu = Big.Precise(math.evaluate(fx.toString(), {x: Big.Precise(xu, SFs) }), SFs)
        let fxl = Big.Precise(math.evaluate(fx.toString(), {x: Big.Precise(xl, SFs) }), SFs)
        steps.push(`$$\\because f(${Big.Precise(xu, SFs)}) = ${fxu}$$`);
        steps.push(`$$f(${Big.Precise(xl, SFs)}) = ${fxl}$$`);
        if (fxl > fxu) {
            xu = xll;
            xl = xuu;
        }
        steps.push(`$$\\therefore x_l = ${Big.Precise(xl, SFs)}$$`);
        steps.push(`$$x_u = ${Big.Precise(xu, SFs)}$$`);
        toBeDrawn.push(
            {
                graphType: 'polyline',
                fn: fx.split("e").join("" + Math.E),
                color: 'orange'
            }
        )
        annots.push(
            {x: xl, text: "xLower"},
            {x: xu, text: "xUpper"},
        )
        if (fxl * fxu > 0) {
            steps.push(`$\\because f(x_l) \\times f(x_u) > 0$`);
            steps.push("$\\therefore x_l, x_u$ are not applicable!");
            return [steps, 0, Status.INVALID_GUESSES, toBeDrawn, annots];
        } else {
            steps.push(`$\\because f(x_l) \\times f(x_u) \\leq 0$`);
            steps.push("$\\therefore x_l, x_u$ are applicable!");
        }
        const L0 = Big.Precise(Math.abs(xu - xl), SFs);
        const k = Math.ceil(Big.Precise(Big.Precise(Math.log10(L0), SFs) - Big.Precise(Math.log10(EPS), SFs), SFs) / Big.Precise(Math.log10(2), SFs))
        steps.push("$\\bigstar$ Getting maximum number of iterations required:")
        steps.push(`$$L_0 = |x_u - x_l| = |${xu} - ${xl}|$$`)
        steps.push("$$k = \\lceil\\frac{log(L_0) - log(E_a)}{log(2)}\\rceil = " + `\\frac{log(${L0}) - log(${EPS})}{${Big.Precise(Math.log10(2), SFs)}}$$`)
        steps.push(`$$k = ${k}$$`)
        var xr = 0, prevXr = null;
        let color = "blue";
        for (let i = 0; i <= imax; i++) {
            prevXr = xr;
            xr = Big.Precise(Big.Precise(xl + xu, 5) / 2, SFs);
            steps.push(`$\\bigstar$ Iteration ${i + 1}:`)
            steps.push(`$$x_r = \\frac{x_l + x_u}{2} = \\frac{${xl} + ${xu}}{2} = ${xr}$$`)
            color = i % 2 ? "rgb(0, 0, 240, 0.3)" : "rgb(240, 0, 0, 0.3)";
            annots.push(
                {x: xr, text: `iteration : ${i + 1}`}
            )
            toBeDrawn.push(
                {
                    vector: [0, 5000],
                    offset: [xl, -2500],
                    graphType: 'polyline',
                    fnType: 'vector',
                    color: color
                },
                {
                    vector: [0, 5000],
                    offset: [xu, -2500],
                    graphType: 'polyline',
                    fnType: 'vector',
                    color: color
                }
            )
            const relativeError = prevXr ?
            Big.Precise(Math.abs(Big.Precise((Big.Precise(xr - prevXr, SFs)) / xr, SFs)) , SFs) : 1

            const fxr = Big.Precise(math.evaluate(fx.toString(), {x: Big.Precise(xr, SFs) }), SFs)
            const fxl = Big.Precise(math.evaluate(fx.toString(), {x: Big.Precise(xl, SFs) }), SFs)
            
            steps.push(`$$|\\epsilon_a| = |\\frac{x_r^{new} - x_r^{old}}{x_r^{new}}| = |\\frac{${xr} - ${prevXr}}{${xr}}| = ${relativeError}$$`);
            if (xr === Infinity || xr === -Infinity) {
                if (xr === Infinity) {
                    steps.push(`$\\because x_r = \\infty$`)
                } else {
                    steps.push(`$\\because x_r = -\\infty$`)
                }
                steps.push(`$\\therefore$ Solution diverges when using bisection method.$`)
                return [steps, xr, Status.DIVERGED, toBeDrawn, annots]
            }
            if (fxr === 0 || (prevXr && Math.abs(xr - prevXr) < EPS) || i >= imax) {
                if (fxr === 0) {
                    steps.push(`$\\because f(x_r) = 0$`)
                } else if ((prevXr && Math.abs(xr - prevXr) < EPS)) {
                    steps.push(`$\\because |x_r - x_{r-1}| = ${Math.abs(xr - prevXr)} < E_a$`)
                } else {
                    steps.push(`$\\because$ Iterations Exhausted.`)
                    return [steps, xr, Status.MAX, toBeDrawn, annots];
                }
                steps.push(`$\\therefore x \\approx ${xr}$`)
                return [steps, xr, Status.CONVERGED, toBeDrawn, annots];
            } else {
                steps.push(`$$f(x_l) = ${f_txt.split('x').join("(" + Big.Precise(xl, SFs) + ")")} = ${fxl}$$`)
                steps.push(`$$f(x_r) = ${f_txt.split('x').join("(" + Big.Precise(xr, SFs) + ")")} = ${fxr}$$`)
                if (Big.Precise(fxl * fxr, SFs) < 0) {
                    steps.push(`$\\because f(x_l) \\times f(x_r) < 0$`);
                    steps.push("$\\therefore$ xr is the new upper bound")
                    xu = xr;
                } else if (Big.Precise(fxl * fxr, SFs) > 0) {
                    steps.push(`$\\because f(x_l) \\times f(x_r) > 0$`);
                    steps.push("$\\therefore$ xr is the new lower bound")
                    xl = xr;
                }
            }
        }
        return [steps, xr, Status.ERROR, toBeDrawn, annots];
    }
}
