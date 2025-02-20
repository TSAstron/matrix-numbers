'use strict';

function gcd(a, b) {
    while (b !== 0n) {
        [a, b] = [b, a % b];
    }
    return a;
}
function naiveLog10(x) { // floor@log
    if( x === 0n ) { return undefined; }
    else {
        let out = 0;
        while( x > 0n ) {
            x /= 10n;
            out++;
        }
        return out;
    }
}
class MatrixNumber {
    constructor( sequence ) {
        //const a0 = sequence(0n)[0];
        this.n = 0n;
        this.prev = [1n, 0n];
        this.curr = sequence(this.n);//[a0, 1n];
        this.f = sequence;
        this.CF = [];
    }
    gcd_red() {
        // reduce both fraction (whole matrix) with the gcd
        const gc = gcd(...this.curr);
        const gp = gcd(...this.prev);
        const g = gcd(gc, gp);
        this.curr = [this.curr[0]/g, this.curr[1]/g];
        this.prev = [this.prev[0]/g, this.prev[1]/g];
    }
    step1() {
        // advance the given (general) fraction by one step
        this.n++;
        const [b, a] = this.f( this.n );
        const next = [this.prev[0]*b+this.curr[0]*a, this.prev[1]*b+this.curr[1]*a];
        [this.curr, this.prev] = [next, this.curr];
        if( this.n%1000n === 0n ) { this.gcd_red(); }
    }
    bite1() {
        // this only egests if possible, without stepping
        if( this.curr[1] == 0 || this.prev[1] == 0 ) {
            return false;
        }
        const oc = this.curr[0]/this.curr[1];
        const op = this.prev[0]/this.prev[1]
        if( oc === op ) {
            this.curr = [ this.curr[1], this.curr[0] % this.curr[1]];
            this.prev = [ this.prev[1], this.prev[0] % this.prev[1]];
            this.CF.push(oc);
            return true;
        } else {
            return false;
        }
    }
    bite() {
        // steps until another regular denominator can be egested
        while( !this.bite1() ) { this.step1(); }
    }
    fromCF() {
        // get a single fraction [numerator, denominator] for the expansion
        if( this.CF.length == 0 ) { return [undefined, undefined, undefined]; }
        else {
            let prev = [1n, 0n];
            let curr = [this.CF[0],1n];
            for( let i = 1; i < this.CF.length; i++ ) {
                const next = [prev[0]+curr[0]*this.CF[i], prev[1]+curr[1]*this.CF[i]];
                [curr, prev] = [next, curr];
            }
            return curr;
        }
    }
    get num() { return this.curr[0]; }
    get den() { return this.curr[1]; }

    digitN() {
        // number of accurate digits
        let iErr = (this.curr[1]*this.prev[1])/(this.curr[0]*this.prev[1]-this.prev[0]*this.curr[1]);
        iErr = iErr > 0 ? iErr : -iErr;
        return naiveLog10(iErr);
    }
    toString() {
        return `${this.prev[0]}/${this.prev[1]}; ${this.curr[0]}/${this.curr[1]}`;
    }
    toDigits() {
        // floating decimal, NOTE that if bite() was used, and denominators extracted,
        // this will be the value of the tail, NOT the whole number
        let [p, q] = this.curr;
        let o = (p/q);
        let str = `${o}.`;
        p = 10n*(p-o*q);
        for(let i = 1; i <= this.digitN(); i++) {
            o = (p/q);
            str += o;
            p = 10n*(p-o*q);
        }
        return str;
    }
}

// sequences for generalized fractions of some constants

function golden_seq(n) {
    return [1n, 1n];
}

function pi_seq(k) {
    if( k == 0n ) {
        return [0n, 1n];
    }
    else if( k == 1n ) {
        return [4n, 1n];
    } else {
        const m = k - 1n;
        return [m*m, 2n*m + 1n];
    }
}

function e_seq(k) {
    if( k == 0n ) {
        return [2n, 1n];
    } else if( k == 1n ) {
        return [1n, 1n];
    } else {
        return [k-1n, k];
    }
}

function log2_seq(k) {
    if( k == 0n ) {
        return [0n, 1n];
    } else if( k == 1n ) {
        return [2n, 3n];
    } else {
        return [-(k-1n)*(k-1n), 6n*k-3n];
    }
}

function zeta2_seq(k) {
    if( k == 0n ) {
        return [0n, 1n];
    } else if( k == 1n ) {
        return [5n, 3n];
    } else {
        const m = (k-1n)*(k-1n);
        return [m*m, 11n*k*(k-1n)+3n];
    }
}
