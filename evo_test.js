var evolution = require('./evolution');
var util = require('./lib/util');
var roulette = require('./lib/selection').roulette;
var next = util.next;
var popFit = util.populationFitness;

var base = [];
for (var i = 0; i < 5; i++) {
    var r = [];
    for (var j = 0; j < 5; j++) {
        r.push(Math.floor(Math.random() * 100));
    }
    base.push(r);
}

var fitnessFn = function(individual) {
    var sum = 0;

    for (var i = 0; i < individual.length; i++) {
        sum += individual[i];
    }

    return sum;
};

var evoEnum = evolution.construct({
    basePopulation: base,
    fitnessFn: fitnessFn,
    maximize: false
});

var loop = evolution.loop({
    basePopulation: base,
    fitnessFn: fitnessFn,
    selector: evoEnum,
    selectionFn: roulette
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
for (i = 1; i <= 500; i++) {
    if (i % 50 === 0) {
        printFit(base);
    }

    var children = loop();
}
printPop(children);
