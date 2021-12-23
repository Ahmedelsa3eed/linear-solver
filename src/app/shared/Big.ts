export class Big {
    private precision: number;
    private value: number;
    constructor(value: number, precision: number) {
        this.precision = precision;
        this.value = +value.toPrecision(precision);
    }
    getPrecision(): number {
        return this.precision;
    }
    getValue(): number {
        return this.value;
    }
    add(other: number | Big): Big {
        this.value += other instanceof Big ?
            +other.getValue().toPrecision(this.precision) :
            +other.toPrecision(this.precision);
        this.value = +this.value.toPrecision(this.precision);
        return this;
    }
    sub(other: number | Big): Big {
        this.value -= other instanceof Big ?
            +other.getValue().toPrecision(this.precision) :
            +other.toPrecision(this.precision);
        this.value = +this.value.toPrecision(this.precision);
        return this;
    }
    mul(other: number | Big): Big {
        this.value *= other instanceof Big ?
            +other.getValue().toPrecision(this.precision) :
            +other.toPrecision(this.precision);
        this.value = +this.value.toPrecision(this.precision);
        return this;
    }
    div(other: number | Big): Big {
        this.value /= other instanceof Big ?
            +other.getValue().toPrecision(this.precision) :
            +other.toPrecision(this.precision);
        this.value = +this.value.toPrecision(this.precision);
        return this;
    }
    pow(other: number | Big): Big {
        const base = this.value;
        const power = other instanceof Big ?
            +other.getValue().toPrecision(this.precision) :
            +other.toPrecision(this.precision);
        for (let i = 0; i < power; i++) {
            this.value *= base;
            this.value = +this.value.toPrecision(this.precision);
        }
        return this;
    }
    sqrt(): Big {
        this.value = Math.sqrt(this.value);
        this.value = +this.value.toPrecision(this.precision);
        return this;
    }
    abs(): Big {
        this.value = Math.abs(this.value);
        return this;
    }
}