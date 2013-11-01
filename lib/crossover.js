var Ix = require('ix');
var next = require('./util').next;

module.exports = {
    onePoint: onePoint,
    twoPoint: twoPoint,
    nPoint: nPoint,
}

/**
 * A filter for every other.
 * @return {Function}
 */
function everyOther() {
    var i = 0;
    return function() {
        return i++ % 2 === 0;
    }
}

/**
 * Performs one point cross over.
 * @param  {Ix.Enumerable} selectorEnum
 * @return {Ix.Enumerable}
 */
function onePoint(selectorEnum) {
    var enu = selectorEnum.getEnumerator();

    return Ix.Enumerable.repeat(1)
        .select(function() {
            var a = next(enu);
            var b = next(enu);
            var l = a.length;
            var idx = Math.floor(Math.random() * l);
            var child = [];

            // TODO: I am sure that we will have to do this differently
            for (var i = 0; i < l; i++) {
                if (i < idx) {
                    child[i] = a[i];
                } else {
                    child[i] = b[i];
                }
            }

            return child;
        });
}

/**
 * Performs two point cross over.
 * @param  {Ix.Enumerable} selectorEnum
 * @return {Ix.Enumerable}
 */
function twoPoint(selectorEnum) {
    var enu = selectorEnum.getEnumerator();

    return Ix.Enumerable.repeat(1)
        .select(function() {
            var a = next(enu);
            var b = next(enu);
            var l = a.length;
            var idx = Math.floor(Math.random() * l);
            var idx2 = idx + Math.floor(Math.random() * (l - idx));

            if (idx > idx2) {
                var t = idx;
                idx = idx2;
                idx = t;
            }

            var child = [];

            for (var i = 0; i < l; i++) {
                if (i < idx || i > idx2) {
                    child[i] = a[i];
                } else {
                    child[i] = b[i];
                }
            }

            return child;
        });
}

/**
 * Performs an n point cross over.
 * @param  {Ix.Enumerable} selectorEnum
 * @return {Ix.Enumerable}
 */
function nPoint(selectorEnum, lambda) {
    var enu = selectorEnum.getEnumerator();
    var idx = 0;
    var reset = false;

    return Ix.Enumerable.repeat(1)
        .select(function() {
            var a = next(enu);
            var b = next(enu);
            var l = a.length;
            var child = [];
            var otherChild = [];

            for (var i = 0; i < l; i++) {
                if (Math.random() > 0.499) {
                    child[i] = a[i];
                    otherChild[i] = b[i];
                } else {
                    child[i] = b[i];
                    otherChild[i] = a[i];
                }
            }
            return [child, otherChild];
        }).scan([], function(a, b) {
            if (reset) {
                reset = false;
                return b;
            }
            return a.concat(b);
        }).filter(function() {
            return idx++ === lambda;
        }).select(function(childPopulation) {
            idx = 0;
            reset = true;
            return childPopulation;
        });
}
