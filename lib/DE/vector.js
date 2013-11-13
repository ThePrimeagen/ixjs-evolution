
module.exports = {
    add: add,
    subtract: subtract,
    multiply: multiply
};

//Adds 2 vectors together, and returns the resulting vector
function add(a, b) {
    var c = [];
    for (var i = 0; i < a.length; i++) {
        c[i] = a[i] + b[i];
    }

    return c;
}

//subtracts 2 vectors from each other, and returns the resulting vector
function subtract(a, b) {
    var c = [];
    for (var i = 0; i < a.length; i++) {
        c[i] = a[i] - b[i];
    }

    return c;
}

//Multiplies 2 vectors together, and returns the resulting vector
function multiply(a, b) {
    var c = [];
    for (var i = 0; i < a.length; i++) {
        c[i] = a[i] * b;
    }

    return c;
}
