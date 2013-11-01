var Ix = require('ix');
var util = require('./util');

module.exports = {
    firstFit: firstFit,
    randomFit: randomFit,
    roulette: rouletteSelector,
    nBest: nBestSelector
};

/**
 * filters with roulette
 * @param  {Array} basePopulation
 * @return {Ix.Enumerable}
 */
function rouletteSelector(basePopulation, fitnessFn) {
    var largestValue = 0;
    var maximize = true;

    return util.sequentialValue(basePopulation)
        .filter(function(individual) {
            var fit = fitnessFn(individual);
            if (fit > largestValue) {
                largestValue = fit;
            }

            if (largestValue === 0) {
                largestValue = 0.001;
            }
            var chance = Math.random();

            // Maximize the closer fit is to largest value the higher the
            // chances (1 - 0.95 == 0.05, 95% chance) of being selected.
            // Minimize is fit / largest  (so if 0.95, 5% chance of being selected).
            var take = maximize ? chance > (0.99 - fit / largestValue) : chance > (fit / largestValue);

            // Always make largest value smaller and smaller.  As our population gets
            // better, so should our largest value.
            largestValue *= 0.999;

            return take;
        })
        .distinct();
}

/**
 * Gets nBest from the population
 * @param  {Array} basePopulation
 * @param  {Function} fitnessFn
 * @param  {Number} n
 * @param  {Boolean} maximize
 * @return {Ix.Enumerable}
 */
function nBestSelector(basePopulation, fitnessFn, n, maximize) {
    var i = 0;
    var newArr = _.clone(basePopulation);
    newArr.sort(function(a, b) {
        if (!a.fit) {
            a.fit = fitnessFn(a);
        }
        if (!b.fit) {
            b.fit = fitnessFn(b);
        }

        return (maximize ? 1 : -1) * (a.fit > b.fit ? 1 : -1);
    });

    return util.sequentialValue(newArr)
        .scan([], function(a, b) {
            return a.concat(b);
        })
        .filter(function(individual) {
            return i++ === n;
        });
}

/**
 * WARN: Fitness does mutate the state of the individual.  It appends the value of
 * 'fit' which is the current fitness of the individual.
 *
 * @param  {Function} fitFn
 * @param  {Number} minimumFitness
 * @param  {Boolean} [max]
 */
function fitness(fitFn, minimumFitness, max) {
    max === undefined ? (max = true) : null;
    minimumFitness === undefined ? (minimumFitness = 0) : null;
    if (typeof minimumFitness === 'number') {
        return function(individual) {
            individual.fit = fitFn(individual);
            return max ? individual.fit >= minimumFitness : individual.fit >= (1 - minimumFitness);
        }
    } else {
        return function(individual) {
            individual.fit = fitFn(individual);
            return true;
        }
    }
}

/**
 * Gets the most fit individual from the population
 * @param  {Array} basePopulation
 * @param  {Function} fitFn
 * @param  {Number} minimumFitness
 * @param  {Boolean} [max]
 * @return {Ix.Enumerable}
 */
function mostFit(basePopulation, fitFn, minimumFitness, max) {
    var l = 0;
    var fitnessFn = fitness(fitFn, minimumFitness, max);

    return util.sequentialValue(basePopulation)
        .filter(fitnessFn)
        .scan(function(prev, curr) {
            return prev.fit > curr.fit ? prev : curr;
        })
        .filter(function() {
            return l + 1 === basePopulation.length;
        })
        .select(function(individual) {
            l = 0;
            return individual;
        });
}

/**
 * Gets the first fit from random selection
 * @param  {Array} basePopulation
 * @param  {Function} fitFn
 * @param  {Number} minimumFitness
 * @param  {Boolean} [max]
 * @return {Ix.Enumerable}
 */
function randomFit(basePopulation, fitFn, minimumFitness, max) {
    var l = 0;
    var fitnessFn = fitness(fitFn, minimumFitness, max);

    return util.randomValue(basePopulation).filter(fitnessFn);
}

/**
 * gets the first sequential individual with this fitness
 * @param  {Array} basePopulation
 * @param  {Function} fitFn
 * @param  {Number} minimumFitness
 * @param  {Boolean} [max]
 * @return {Ix.Enumerable}
 */
function firstFit(basePopulation, fitFn, minimumFitness, max) {
    var l = 0;
    var fitnessFn = fitness(fitFn, minimumFitness, max);

    return util.sequentialValue(basePopulation).filter(fitnessFn);
}

