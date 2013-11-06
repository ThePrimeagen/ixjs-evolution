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
 *     n: Number
 * }} options should contain p and n, the probability to select from trial vector
 * and the amount of selections to perform, respectively.
 * @return {Ix.Enumerable}
 */
function binomialCrossOver(selector, options) {
    var n = options.n || 1;
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

    return util.selectN(crossOver, n);
}

/**
 * Exponential crossover crosses an individual with its trial vector.
 * @param  {Ix.Enumerable} selector
 * @param {{
 *     p: Number,
 *     n: Number
 * }} options should contain p and n, the probability to select from trial vector
 * and the amount of selections to perform, respectively.
 * @return {Ix.Enumerable}
 */
function exponentialCrossOver() {
    var n = options.n || 1;
    var p = options.p || 0.5;
    var crossOver = selector

        // From mutation.js : [individual, trialVector]
        .select(function(res) {
            var ind = res[0];
            var trial = res[1];
            var i = Math.floor(Math.random() * trial.length);
            var child = [];
            var prob = 1;

            // Gaurentee of at least 1
            for (; i < trial.length; i++) {
                child[i] = Math.random() < prob ? trial[i] : ind[i];
                prop *= p;
            }

            return [child];
        });

    return util.selectN(crossOver, n);
}

