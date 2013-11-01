var selection = require('./lib/selection');
var crossOver = require('./lib/crossover');
var mutation = require('./lib/mutation');
var population = require('./lib/population');
var next = require('./lib/util').next;
var _ = require('lodash');

// Exports the set of enumerables.
module.exports = {

    xOverType : {
        1_POINT : crossOver.onePoint,
        2_POINT : crossOver.twoPoint,
        N_POINT : crossOver.nPoint
    },

    selectionType : {
        FIRST_FIT : selection.firstFit,
        RANDOM_FIT : selection.randomFit,
        WEIGHTED_ROULETTE : selection.weightedRoulette,
    },

    mutationType : {
        GAUSSIAN : 1,
    },

    /**
     * Grabs the first fittest individual from the population.  It uses the
     * sequential enumerator for selection so the results will always be
     * consistent.
     *
     * @param  {Array} basePopulation
     * @param  {Function} fitnessFn
     * @param  {Number} minFit
     * @param  {Number} prop
     * @return {Ix.Enumerable}
     */
    firstFitRandomMutation: function(basePopulation, options) {
        var settings = _.assign({
            selectionFn: selectionType.FIRST_FIT,
            xOverFn: xOverType.1_POINT,
            mutationFn: mutationType.GAUSSIAN,
            fitnessFn: null;
        }, options);

        var select = selectionFn(basePopulation, fitnessFn, options);
        var xOver = xOverFn(basePopulation, fitnessFn, options);
        var mutate = mutationFn(xOver, options);

        return mutate.getEnumerator();
    },

    /**
     * Performs a roulette selection from the provided population
     * @param  {Array} basePopulation
     * @param  {Function} fitnessFn
     * @param  {Number} lambda The amount to select from the population
     * @return {Array} A subset of the base population selected by their fitness
     */
    rouletteSelection: function(basePopulation, fitnessFn, lambda) {
        var enu = population.rouletteSelector(basePopulation, fitnessFn);
        return enu.getEnumerator();
    }
};
