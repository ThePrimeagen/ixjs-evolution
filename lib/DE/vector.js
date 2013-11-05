
module.exports = {
    add: add,
    subtract: subtract,
    multiply: multiply
};

function add(a, b) {
    var c = [];
    for (var i = 0; i < a.length; i++) {
        c[i] = a[i] + b[i];
    }

    return c;
}

function subtract(a, b) {
    var c = [];
    for (var i = 0; i < a.length; i++) {
        c[i] = a[i] - b[i];
    }

    return c;
}

function multiply(a, b) {
    var c = [];
    for (var i = 0; i < a.length; i++) {
        c[i] = a[i] * b;
    }

    return c;
}
