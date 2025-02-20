'use strict';

const num1 = new MatrixNumber(pi_seq);
const num2 = new MatrixNumber(pi_seq); // unreduced twin, for bracketing of pi
function another() {
    num1.bite(); // get another term in CF
    while( num2.n < num1.n ) num2.step1(); //keep both nums at the same iteration
    // reverse collect the expansion, CF, into explicit latex fraction
    let ltx = num1.CF[num1.CF.length-1];
    for( let i=num1.CF.length-2; i>=0; i--) {
        ltx =`${num1.CF[i]} + \\cfrac{1}{${ltx}}`;
    }
    const [a, b] = num1.fromCF(); // single fraction corresponding to CF
    katex.render(`\\pi \\approx \\frac{${a}}{${b}} =` + ltx,
        output, {throwOnError: false} );
    num2.gcd_red(); // reduce the fractions with gcd (display...)
    let [[a1, b1], [a2, b2]] = [num2.prev, num2.curr];
    if( a1*b2 > a2*b1 ) [[a1, b1], [a2, b2]] = [[a2, b2], [a1, b1]] // check bracketing order
    katex.render(`\\pi \\in \\left[\\frac{${a1}}{${b1}}, \\frac{${a2}}{${b2}}\\right] \\rightarrow ` + num2.toDigits(),
        output2, {throwOnError: false} );
}
another();
