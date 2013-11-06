var GA = require('./lib/GA/index');
var ES = require('./lib/ES/index');

var gaCrossOver = GA.crossOver;
var gaMutation = GA.mutation;
var esCrossover = ES.crossOver;
var esMutation = ES.mutation;

var util = require('./lib/util');
var selection = require('./lib/selection');
var next = util.next;
var selectN = util.selectN;
var _ = require('lodash');

var selectionType = {
    FIRST_FIT: selection.firstFit,
    RANDOM_FIT: selection.randomFit,
    WEIGHTED_ROULETTE: selection.weightedRoulette,
};

var mutationType = {
    GA_GAUSSIAN: gaMutation.gaussian,
    ES_GAUSSIAN: esMutation.gaussian
};

var xOverType = {
    GA_ONE_POINT: gaCrossOver.onePoint,
    GA_TWO_POINT: gaCrossOver.twoPoint,
    GA_N_POINT: gaCrossOver.nPoint,
    ES_N_POINT: esCrossover.nPoint
};

// Exports the set of enumerables.
module.exports = {

    xOverType: xOverType,
    selectionType: selectionType,
    mutationType: mutationType,

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
    constructGA: function(options) {
        var settings = _.assign({
            selectionFn: selectionType.FIRST_FIT,
            xOverFn: xOverType.GA_ONE_POINT,
            mutationFn: mutationType.GA_GAUSSIAN,
            fitnessFn: null,
            basePopulation: [],
            maximize: true,
            lambda: 0,
            heightAdjust: 1, //Used for Gaussian mutation
            sigma: 1, //Used for Gaussian mutation
            minFit: null, //Used for the selection schemes utilizing a min/max fitness for selection
        }, options);

        if (settings.lambda === 0) {
            settings.lambda = settings.basePopulation.length;
        }

        var select = settings.selectionFn(settings);
        var xOver = settings.xOverFn(select, settings.lambda);
        var mutate = settings.mutationFn(xOver, settings);

        return mutate.getEnumerator();
    },


    constructES: function(options) {
        var settings = _.assign({
            selectionFn: selectionType.FIRST_FIT,
            xOverFn: xOverType.ES_N_POINT,
            mutationFn: mutationType.ES_GAUSSIAN,
            fitnessFn: null,
            basePopulation: [],
            maximize: true,
            lambda: 0,
            heightAdjust: 1, //Used for Gaussian 
            sigma: 1, //Used for Gaussian mutation
            minFit: null, //Used for the selection schemes utilizing a min/max fitness for selection

            numParents: 2,
            numChildren: 2
        }, options);

        initializePopulationParameters(options.basePopulation, sigma);

        if (settings.lambda === 0) {
            settings.lambda = settings.basePopulation.length;
        }

        var select = settings.selectionFn(settings);
        var xOver = settings.xOverFn(select, settings.lambda, options.numParents, options.numChildren);
        var mutate = settings.mutationFn(xOver, settings);

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
        var enu = selection.rouletteSelector({
            basePopulation: basePopulation,
            fitnessFn: fitnessFn,
            lambda: lambda
        });
        enu = selectN(enu, lambda);
        return next(enu.getEnumerator());
    },

    /**
     * Its the evolution circle of life.  This will perform the lambda selection on the children
     * and mutate the base population through the provided populationSelector.
     *
     * @param {{
     *     generational: Boolean,
     *     fixedPopulation: Boolean,
     *     maximize: Boolean,
     *     basePopulation: Array,
     *     selector: Ix.Enumerable,
     *     selectionFn: Function,
     *     fitnessFn: Function
     * }} options
     * @return {Function} The function that will progress the population one more generation
     */
    loop: function(options) {
        var config = _.assign({
            generational: false,
            fixedPopulation: true,
            maximize: false
        }, options);

        // Purely for optimizing. It kind of defeats the purpose of constructing a config
        var basePopulation = config.basePopulation;
        var selector = config.selector;
        var selectionFn = config.selectionFn;
        var generational = config.generational;
        var max = config.maximize;

        return function() {

            // sets up the children and the next population.
            var children = next(selector);
            var newPop = children;
            if (!generational) {
                newPop = newPop.concat(basePopulation);
            }

            // Mutates the base population with the selectionFn

            var selectionEnum = selectionFn({
                fitnessFn: config.fitnessFn,
                basePopulation: newPop,
                maximize: config.maximize
            }).getEnumerator();

            for (var i = 0; i < basePopulation.length; i++) {
                basePopulation.pop();
                basePopulation.unshift(next(selectionEnum));
            }

            return children;
        };
    }

    initializePopulationParameters: function(population, sigmaRange) {
        for(var i = 0; i < population.length; i++) {
            population[i].params = [];
            for (var j = 0; j < population[i].length; j++) {
                population[i].params.push(Math.random() * sigmaRange);   
            }
        }
    }
};
