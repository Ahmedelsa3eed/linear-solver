import * as math from "mathjs";
import { simplify } from "mathjs"
import { Big } from "src/app/shared/Big";
import { Status } from "src/app/shared/Status.model";

export class RegulaFalsi{
    private readonly SFs: number
    constructor(sfs : number){
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
        steps.push("$\\blacksquare$ Applying Regula-Falsi method:");
        const f_txt: string = simplify(fx).toTex().split("cdot").join("times");
        steps.push("$$f(x) = " + f_txt + "$$");
        let fxu = Big.Precise(math.evaluate(fx.toString(), {x: Big.Precise(xu, SFs)}), SFs)
        let fxl = Big.Precise(math.evaluate(fx.toString(), {x: Big.Precise(xl, SFs)}), SFs)
        steps.push("$\\bigstar$ Setting lower and upper gueses:");
        steps.push(`$$\\because f(${Big.Precise(xu, SFs)}) = ${fxu}$$`);
        steps.push(`$$f(${Big.Precise(xl, SFs)}) = ${fxl}$$`);
        if (fxl > fxu) {
            const temp = xu
            xu = xl;
            xl = temp;
        }
        steps.push(`$$\\therefore x_l = ${Big.Precise(xl, SFs)}$$`);
        steps.push(`$$x_u = ${Big.Precise(xu, SFs)}$$`);
        toBeDrawn.push(
            {
                graphType: 'polyline',
                fn: fx.split("e").join("" + Math.E),
                color:'orange'
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
        let prevXr = null , xr =0;
        let color = "";
        for (let i = 0; i <= imax; i++) {
            fxu = Big.Precise(math.evaluate(fx.toString(), {x: Big.Precise(xu, SFs) }), SFs)
            fxl = Big.Precise(math.evaluate(fx.toString(), {x: Big.Precise(xl, SFs) }), SFs)
            prevXr = xr;
            xr =
                new Big(
                    new Big(xl, SFs)
                    .mul(fxu)
                    .div(
                        new Big(fxu, SFs)
                        .sub(fxl)
                    ),
                    SFs
                ).sub(
                    new Big(
                        new Big(xu, SFs)
                        .mul(fxl)
                        .div(
                            new Big(fxu, SFs)
                            .sub(fxl)
                        ),
                        SFs
                    )
                )
                .getValue();
            
            steps.push(`$\\bigstar$ Iteration ${i + 1}:`)
            steps.push(`$$x_r = \\frac{x_l \\times f(x_u) - x_u \\times f(x_l)}{f(x_u) - f(x_l)} = \\frac{${xl} \\times ${fxu} - ${xu} \\times ${fxl}}{${fxu} - ${fxl}} = ${xr}$$`)
            color = i % 2 ? "rgb(0,0,240,0.5)" : "rgb(240,0,0,0.5)";
            if(i != 0) {
                annots.push(
                    {x: xr, text: `iteration : ${i+1}`},
                    {x: xl},
                    {x: xu}
                )
            }
            toBeDrawn.push(
                {
                    fnType: 'points',
                    graphType: 'polyline',
                    points:[
                        [xl, fxl], [xu, fxu]
                    ],
                    color:color
                },

            )
            const relativeError = prevXr ?
            Big.Precise(Math.abs(Big.Precise((Big.Precise(xr - prevXr, SFs)) / xr, SFs)) , SFs) : 1
            
            let fxr = Big.Precise(math.evaluate(fx.toString(),{x:Big.Precise(xr,SFs) }),SFs)
            fxl = Big.Precise(math.evaluate(fx.toString(),{x:Big.Precise(xl,SFs) }),SFs)
            
            steps.push(`$$|\\epsilon_a| = |\\frac{x_r^{new} - x_r^{old}}{x_r^{new}}| = |\\frac{${xr} - ${prevXr}}{${xr}}}| = ${relativeError}$$`);
            if(xr === Infinity || xr === -Infinity) {
                if (xr === Infinity) {
                    steps.push(`$\\because x_r = \\infty$`)
                } else {
                    steps.push(`$\\because x_r = -\\infty$`)
                }
                steps.push(`$\\therefore$ Solution diverges when using Regula-Falsi method.$`)
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
                    steps.push("$\\therefore$ xr is the new lower bound")
                    xl = xr;
                } else if (Big.Precise(fxl * fxr, SFs) > 0) {
                    steps.push(`$\\because f(x_l) \\times f(x_r) > 0$`);
                    steps.push("$\\therefore$ xr is the new upper bound")
                    xu = xr;
                }
            }
        }
        return [steps, xr, Status.MAX, toBeDrawn, annots];
    }
    
}