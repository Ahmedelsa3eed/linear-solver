import { TestBed } from "@angular/core/testing";
import { Seacant } from "../Seacant/Seacant";

describe("Seacant", () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [Seacant],
        }).compileComponents();
    });

    it("using Seacant f(x) = x^(2)-2", () => {
        const seacant = new Seacant(9)
        const x = seacant.solve('x^(2)-2', 0.5, 1)
        expect(x[1]).toBeCloseTo( 1.41421)
    });

    it("using Seacant f(x) =  x-cos(x)", () => {
        const seacant = new Seacant(10)
        const x = seacant.solve('x-cos(x)', 1,1.5, 50, 0.00001)
        expect(x[1]).toBe(0.7390851332)
    });

   it("root of x3-x-1 using Seacant mehtod is 1.32472", () => {
        const seacant = new Seacant(6)
        const x = seacant.solve('x^(3)-x-1', 1.5,1.9, 50)
        expect(x[1]).toBe(1.32472)
    });

    it("root of 2x3-2x-5 using Seacant mehtod is 1.6006", () => {
        const seacant = new Seacant(5)
        const x = seacant.solve('2x^(3)-2x-5', 1.5,2.5, 50)
        expect(x[1]).toBe(1.6006)
    });

   it("Seacant is linearly convergent toward the true value of 1.0.", () => {
        const seacant = new Seacant(7)
        const x = seacant.solve('x^(3)-5x^(2)+7x-3', 0.9,0, 50)
        expect(x[1]).toBeCloseTo(0.9776551)
    });

    it("one root of x^3 - x^2 - 15x + 1 at x0 = -3.5 accurate to six decimal placed", () => {
        const seacant = new Seacant(10)
        const x = seacant.solve('x^(3)-x^(2)-15x+1', -3.5,-3.6 ,15)
        expect(x[1]).toBe(-3.44214617)
    });

    it("one root of x^3 - x^2 - 15x + 1 at x0 = 0 accurate to six decimal placed", () => {
        const seacant = new Seacant(10)
        const x = seacant.solve('x^(3)-x^(2)-15x+1', 0 , 1 , 6 )
        expect(x[1]).toBe(0.06639231426)
    });

    it("one root of x^3 - x^2 - 15x + 1 at x0 = 4.5 accurate to six decimal placed", () => {
        const seacant = new Seacant(10)
        const x = seacant.solve('x^(3)-x^(2)-15x+1', 4.5 , 4 , 10 )
        expect(x[1]).toBe(4.375753856)
    });
    
});