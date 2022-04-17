import { TestBed } from "@angular/core/testing";
import { Bisection } from "./Bisection";

describe("Bisection Method", () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [Bisection],
        }).compileComponents();
    });

    it("using Bisection to solve f(x) = e^(-x)-x = 0", () => {
        const fixed = new Bisection(9)
        const x = fixed.solve('e^(-x)-x', -3,3 ,50, 0.000001)
        console.log(x);
        console.log(x[2].toString());
        expect(x[1]).toBeCloseTo(0.567143290)
    });
    
    it("using FixedPoint f(x) =  x-cos(x)", () => {
        const fixed = new Bisection(10)
        const x = fixed.solve('x-cos(x)', -10,2, 100, 0.00001)
        console.log(x);
        expect(x[1]).toBeCloseTo(0.7390851332)
    });
    it("root of x3-x-1 using Fixed point mehtod is 1.32472", () => {
        const newton = new Bisection(6)
        const x = newton.solve('x^(3)-x-1',-2, 4, 50)
        console.log(x);
        expect(x[1]).toBeCloseTo(1.32472)
    });
    
    it("root of 2x3-2x-5 using Fixed point mehtod is 1.6006", () => {
        const newton = new Bisection(5)
        const x = newton.solve('2x^(3)-2x-5', -6,3, 50)
        console.log(x);
        expect(x[1]).toBeCloseTo(1.6006)
    });
    it("root of x-e^(-x) using Fixed point mehtod is 1.6006", () => {
        const newton = new Bisection(5)
        const x = newton.solve('x-e^(-x)', -2,3,42)
        console.log(x);
        expect(x[1]).toBeCloseTo(0.567)
    });
    

});