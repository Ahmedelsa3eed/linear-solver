export class Big {
    private precision: number;
    private value: number;
    constructor(precision: number, value: number) {
        this.precision = precision;
        this.value = +value.toPrecision(precision);
    }
    getPrecision(): number {
        return this.precision;
    }
    getValue(): number {
        return this.value;
    }
    add(other: number): Big {
        this.value += +other.toPrecision(this.precision);
        this.value = +this.value.toPrecision(this.precision);
        return this;
    }
    sub(other: number): Big {
        this.value -= +other.toPrecision(this.precision);
        this.value = +this.value.toPrecision(this.precision);
        return this;
    }
    mul(other: number): Big {
        this.value *= +other.toPrecision(this.precision);
        this.value = +this.value.toPrecision(this.precision);
        return this;
    }
    div(other: number): Big {
        this.value /= +other.toPrecision(this.precision);
        this.value = +this.value.toPrecision(this.precision);
        return this;
    }
    pow(other: number): Big {
        const base = this.value;
        for (let i = 0; i < other; i++) {
            this.value *= base;
            this.value = +this.value.toPrecision(this.precision);
        }
        return this;
    }
}