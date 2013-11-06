var Ix = require('ix');

module.exports = {
    randomValue: randomValue,
    sequentialValue: sequentialValue,
    next: next,
    selectN: selectNFilter,
    populationFitness: populationFitness
};

var instanceCount = 0;

/**
 * Takes in a population and a fitnessFunction and determine
 * @param  {[type]} population [description]
 * @param  {[type]} fitnessFn  [description]
 * @return {[type]}            [description]
 */
function populationFitness(population, fitnessFn) {
    var sum = 0;
    for (var i = 0; i < population.length; i++) {
        sum += fitnessFn(population[i]);
    }

    return sum;
}

/**
 * Moves an enumerator forward
 * @param  {Ix.Enumerator}
 * @return {Mixed} next value from enum
 */
function next(enu) {
    enu.moveNext();
    return enu.getCurrent();
}

/**
 * Creates an enumerable off of a population
 * @param  {Array} basePopulation
 * @return {Ix.Enumerator}
 */
function populationEnumerator(basePopulation) {
    return Ix.Enumerable.repeat(1).select(function() {
        return basePopulation;
    });
}

/**
 * Chooses a random individual from the population.
 * @param  {Array} basePopulation
 * @return {Ix.Enumerator}
 */
function randomValue(basePopulation) {
    return populationEnumerator(basePopulation)
        .select(function(pop) {
            var ind = pop[Math.floor(Math.random() * pop.length)];
            if (!ind.id) {
                ind.id = instanceCount++;
            }
            return ind;
        });
}

/**
 * Chooses a random individual from the population.
 * @param  {Array} basePopulation
 * @return {Ix.Enumerator}
 */
function sequentialValue(basePopulation) {
    var idx = 0;
    return populationEnumerator(basePopulation)
        .select(function(pop) {
            var l = pop.length;
            if (idx >= l) {
                idx = 0;
            }

            var ind = pop[idx++];
            if (!ind.id) {
                ind.id = instanceCount++;
            }

            return ind;
        });
}

/**
 * Takes in a selector and will provide an selectN filter to it
 * @param {Ix.Enumerable} selector
 * @param {Number} n
 * @return {Ix.Enumerable}
 */
function selectNFilter(selector, n) {
    var idx = 1;
    return selector
        .scan([], function(a, b) {
            if (idx === 1) {

                // makes b into an array if its not. else its just b
                return [].concat(b);
            }
            return a.concat(b);
        })
        .filter(function() {
            return idx++ === n;
        })
        .select(function(val) {
            idx = 0;
            return val;
        });
}

function distinctValues(n, m) {
    var base = [];
    for (var i = 0; i < n; i++) {
        base[i] = [i];
    }

    return selectNFilter(randomValue(base).distinct(), m);
}











// space for readibility