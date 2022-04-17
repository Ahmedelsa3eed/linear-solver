import { TestBed } from "@angular/core/testing";
import { NewtonRaphson } from "./NewtonRaphson";

describe("Newton Raphson", () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NewtonRaphson],
        }).compileComponents();
    });

    it("using newtonRaphson f(x) = e^(-x)-x", () => {
        const newton = new NewtonRaphson(9)
        const x = newton.solve('e^(-x)-x', 0, 50, 0.000000001)
        expect(x[1]).toBe(0.567143290)
    });

    it("using newtonRaphson f(x) =  x-cos(x)", () => {
        const newton = new NewtonRaphson(10)
        const x = newton.solve('x-cos(x)', 1, 50, 0.00001)
        expect(x[1]).toBe(0.7390851332)
    });

    it("root of x3-x-1 using Newton Raphson mehtod is 1.32472", () => {
        const newton = new NewtonRaphson(6)
        const x = newton.solve('x^(3)-x-1', 1.5, 50, 1)//default eps=1
        expect(x[1]).toBe(1.32472)
    });

    it("root of 2x3-2x-5 using Newton Raphson mehtod is 1.6006", () => {
        const newton = new NewtonRaphson(5)
        const x = newton.solve('2x^(3)-2x-5', 1.5, 50, 1)
        expect(x[1]).toBe(1.6006)
    });

    it("newton-raphson is linearly convergent toward the true value of 1.0.", () => {
        const newton = new NewtonRaphson(7)
        const x = newton.solve('x^(3)-5x^(2)+7x-3', 0, 6, 1)
        expect(x[1]).toBe(0.9776551)
    });

    it("one root of x^3 - x^2 - 15x + 1 at x0 = -3.5 accurate to six decimal placed", () => {
        const newton = new NewtonRaphson(10)
        const x = newton.solve('x^(3)-x^(2)-15x+1', -3.5, 50, 1)
        expect(x[1]).toBe(-3.44214617)
    });

    it("one root of x^3 - x^2 - 15x + 1 at x0 = 0 accurate to six decimal placed", () => {
        const newton = new NewtonRaphson(10)
        const x = newton.solve('x^(3)-x^(2)-15x+1', 0, 50, 1)
        expect(x[1]).toBe(0.06639231426)
    });

    it("one root of x^3 - x^2 - 15x + 1 at x0 = 4.5 accurate to six decimal placed", () => {
        const newton = new NewtonRaphson(10)
        const x = newton.solve('x^(3)-x^(2)-15x+1', 4.5, 50, 1) 
        expect(x[1]).toBe(4.375753856)
    });
    
});