var Ix = require('ix');

module.exports = {
    gaussian: gaussian
}

/**
 * Randomly mutates the individual.  The stream coming in better be from a
 * crossover operation.
 *
 * @param  {Ix.Enumerable} selectorEnum
 * @param  {Number} probability
 * @return {Ix.Enumerable}
 */
function gaussian(selectorEnum, options) {
    return selectorEnum
        .select(function(population) {
            //for each member of the population:
            for (var i = 0; i < population.length; i++) {
                var individual = population[i];

                //for each chromosome:
                for (var j = 0; j < individual.length; j++) {
                    //Use a gaussian to change the value of the individual
                    var center = Math.random();
                    var sigmaBase = 2 * individual.params[j] * individual.params[j];
                    var partial = Math.pow(Math.E, -1 * center * center / sigmaBase);
                    var result = (Math.random() > 0.5 ? 1 : -1) * options.heightAdjust * partial;

                    //Anneal the parameter according to our mutation rate and amount
                    var sigmaAdjust = Math.random();
                    if(sigmaAdjust > options.sigmaMutationRate) {
                        individual.params[j] /= options.sigmaMutationAmount;
                    } else {
                        individual.params[j] *= options.sigmaMutationAmount;
                    }

                    //Adjust the individual's chromosome by the mutation amount
                    individual[j] += result;
                }
            }

            return population;
        });
}