var Ix = require('ix');
var util = require('../util');
var next = util.next;
var vector = require('./vector');

module.exports = {
    trialVector: trialVectorRandom
};

/**
 * Creates a trial vector from a random person from within the population
 * @param  {{}} options
 * @return {Ix.Enumerable}
 */
function trialVectorRandom(options) {
    var base = options.basePopulation;
    var beta = options.beta;
    var randEnum = util.randomValue(base);


    return util.sequentialValue(base)
        .select(function(ind) {
            var abc = [];
            var rEnu = randEnum.distinct().getEnumerator();

            // selects 3 random values
            while (abc.length !== 3) {
                var r = next(rEnu);
                if (r.id === ind.id) {
                    continue
                }
                abc.push(r);
            }

            var ui = vector.add(
                abc[0],
                vector.multiply(
                    vector.subtract(abc[1], abc[2]),
                    beta
                )
            );

            // Returns the trial vector and the individual for cross over
            return [ind, ui];
        });
}

