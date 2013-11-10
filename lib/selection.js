var Ix = require('ix');
var util = require('./util');
var _ = require('lodash');

module.exports = {
    firstFit: firstFit,
    randomFit: randomFit,
    roulette: rouletteSelector,
    nBest: nBestSelector,
    mostFit: mostFit
};

/**
 * Selects a single member from the population.  The selection will be distinct each
 * select.  So the maximum number of selections available from this enum is population.length
 *
 * If base population has been changed, this function should be reinitialized.
 *
 * @param  {{}} options
 * @return {Ix.Enumerable}
 */
function rouletteSelector(options) {
    //Pull our options off of the options object
    var basePopulation = options.basePopulation;
    var fitnessFn = options.fitnessFn;

    var largestValue = 0;
    var maximize = options.maximize;
    var fitSum = 0;
    for (var i = 0; i < basePopulation.length; i++) {
        var ind = basePopulation[i];
        ind.fit = fitnessFn(ind);
        fitSum += maximize ? ind.fit : (1 / ind.fit);
    }

    var selector = util.sequentialValue(basePopulation).getEnumerator();
    return Ix.Enumerable.repeat(1)
        .select(function() {
            var total = Math.random() * fitSum;
            var ind = null;

            while (total > 0) {
                ind = util.next(selector);
                total -= maximize ? ind.fit : (1 / ind.fit);
            }

            return ind;
        }).distinct();
}

/**
 * Gets nBest from the population
 * @param  {Array} basePopulation
 * @param  {Function} fitnessFn
 * @param  {Number} n
 * @param  {Boolean} maximize
 * @return {Ix.Enumerable}
 */
function nBestSelector(options) {
    //Fill out our fields pulled from the options object
    var basePopulation = options.basePopulation;
    var fitnessFn = options.fitnessFn;
    var n = options.lambda;
    var maximize = options.maximize;

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
function fitnessSelector(options) {
    var fitFn = options.fitnessFn;
    var minFit = options.minFit;
    var maximize = options.maximize;

    if (typeof minFit === 'number') {
        return function(individual) {
            individual.fit = fitFn(individual);
            return maximize ? individual.fit >= minFit : individual.fit >= (1 - minFit);
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
function mostFit(options) {
    var l = 0;
    var fitnessFn = fitnessSelector(options.fitnessFn, options.minFit, options.maximize);

    return util.sequentialValue(options.basePopulation)
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
function randomFit(options) {
    var l = 0;
    var fitnessFn = fitnessSelector(options.fitnessFn, options.minFit, options.maximize);

    return util.randomValue(options.basePopulation).filter(fitnessFn);
}

/**
 * gets the first sequential individual with this fitness
 * @param  {Array} basePopulation
 * @param  {Function} fitFn
 * @param  {Number} minimumFitness
 * @param  {Boolean} [max]
 * @return {Ix.Enumerable}
 */
function firstFit(options) {
    var l = 0;
    var fitnessFn = fitnessSelector(options);

    return util.sequentialValue(options.basePopulation).filter(fitnessFn);
}

