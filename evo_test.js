var evolution = require('./evolution');
var util = require('./lib/util');
var roulette = require('./lib/selection').roulette;
var next = util.next;
var popFit = util.populationFitness;
var _ = require('lodash');

var base = [];
for (var i = 0; i < 200; i++) {
    var r = [];
    for (var j = 0; j < 5; j++) {
        r.push(Math.floor(Math.random() * 100));
    }
    base.push(r);
}

var fitnessFn = function(individual) {
    var sum = 0;

    for (var i = 0; i < individual.length; i++) {
        sum += Math.abs(individual[i]);
    }

    return sum;
};

var max = false;
var evoEnum = evolution.constructES({
    basePopulation: base,
    fitnessFn: fitnessFn,
    maximize: max
});

var loop = evolution.loop({
    basePopulation: base,
    fitnessFn: fitnessFn,
    selector: evoEnum,
    selectionFn: roulette,
    maximize: max
});

function printFit(pop) {
    console.log('Population' + popFit(pop, fitnessFn));
}

function printPop(pop) {
    for (var i = 0; i < pop.length; i++) {
        console.log(pop[i]);
    }
}

printPop(base);
for (i = 1; i <= 30; i++) {
    if (i % 100 === 0) {
        printFit(base);
    }

    var children = loop();
}

// Gets the most fit child.
var mostFit = _.reduce(base, function(a, b) {
    if (!a) {
        return b;
    }

    return max ? (b.fit > a.fit ? b : a) : (b.fit > a.fit ? a : b);
}, null);
console.log(mostFit);
