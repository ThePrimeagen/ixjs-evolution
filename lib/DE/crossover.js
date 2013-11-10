var Ix = require('ix');
var util = require('./../util');
var next = util.next;

module.exports = {
    binomial: binomialCrossOver,
    exponential: exponentialCrossOver
};

/**
 * Binomial crossover crosses an individual with its trial vector.
 * @param  {Ix.Enumerable} selector
 * @param {{
 *     p: Number,
 *     lambda: Number
 * }} options should contain p and lambda, the probability to select from trial vector
 * and the amount of selections to perform, respectively.
 * @return {Ix.Enumerable}
 */
function binomialCrossOver(selector, options) {
    var lambda = options.lambda || 1;
    var p = options.p || 0.5;
    var crossOver = selector

        // From mutation.js : [individual, trialVector]
        .select(function(res) {
            var ind = res[0];
            var trial = res[1];
            var i = 0;
            var child = [];

            for (i = 0; i < trial.length; i++) {
                child[i] = Math.random() > p ? trial[i] : ind[i];
            }

            // Gaurentee of at least 1
            var randIdx = Math.floor(Math.random() * trial.length);
            child[randIdx] = trial[randIdx];

            return [child];
        });

    return util.selectN(crossOver, lambda);
}

/**
 * Exponential crossover crosses an individual with its trial vector.
 * @param  {Ix.Enumerable} selector
 * @param {{
 *     p: Number,
 *     lambda: Number
 * }} options should contain p and lambda, the probability to select from trial vector
 * and the amount of selections to perform, respectively.
 * @return {Ix.Enumerable}
 */
function exponentialCrossOver(selector, options) {
    var lambda = options.lambda || 1;
    var p = options.p || 0.5;
    var crossOver = selector

        // From mutation.js : [individual, trialVector]
        .select(function(res) {
            var ind = res[0];
            var trial = res[1];
            var idx = Math.floor(Math.random() * trial.length);
            var i = 0;
            var child = [];
            var prob = 1;

            // Before the idx has to be from the individual
            for (i = 0; i < idx; i++) {
                child[i] = ind[i];
            }
            for (i = idx; i < trial.length; i++) {
                if (Math.random() < prob) {
                    child[i] = trial[i];
                } else {
                    child[i] = ind[i];
                    break;
                }
                prob *= p;
            }

            // After the expo fails from selecting from trial, the rest
            // has to be from the individual.
            for (; i < trial.length; i++) {
                child[i] = ind[i];
            }

            return [child];
        });

    return util.selectN(crossOver, lambda);
}

