import { TestBed } from "@angular/core/testing";
import { FixedPoint } from "./FixedPoint";

describe("Fixed Point", () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FixedPoint],
        }).compileComponents();
    });

    it("using FixedPoint f(x) = e^(-x)-x", () => {
        const fixed = new FixedPoint(9)
        const x = fixed.solve('e^(-x)-x', 0, 50, 0.00000001)
        console.log(x);
        console.log(x[2].toString());
        expect(x[1]).toBeCloseTo(0.567143290)
    });
    
    it("using FixedPoint f(x) =  x-cos(x)", () => {
        const fixed = new FixedPoint(10)
        const x = fixed.solve('x-cos(x)', 1, 100, 0.00001)
        console.log(x);
        expect(x[1]).toBeCloseTo(0.7390851332)
    });
    it("root of x3-x-1 using Fixed point mehtod is 1.32472", () => {
        const newton = new FixedPoint(6)
        const x = newton.solve('x^(3)-x-1', 1.5, 50)
        console.log(x);
        expect(x[1]).toBeCloseTo(1.32472)
    });
    
    it("root of 2x3-2x-5 using Fixed point mehtod is 1.6006", () => {
        const newton = new FixedPoint(5)
        const x = newton.solve('2x^(3)-2x-5', 1.5, 50)
        console.log(x);
        expect(x[1]).toBeCloseTo(1.6006)
    });
    it("root of x-e^(-x) using Fixed point mehtod is 1.6006", () => {
        const newton = new FixedPoint(5)
        const x = newton.solve('x-e^(-x)', 3,40)
        console.log(x);
        expect(x[1]).toBeCloseTo(0.567)
    });
    it("root of x-e^(-x) using Fixed point mehtod is 1.6006", () => {
        const newton = new FixedPoint(5)
        const x = newton.solve('x-e^(-x)', 3,40)
        console.log(x);
        expect(x[1]).toBeCloseTo(0.567)
    });

});