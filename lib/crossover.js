var Ix = require('ix');
var next = require('./util').next;

module.exports = {
    onePoint: onePoint,
    twoPoint: twoPoint,
    nPoint: nPoint,
}

/**
 * Performs one point cross over.
 * @param  {Ix.Enumerable} selectorEnum
 * @return {Ix.Enumerable}
 */
function onePoint(selectorEnum, lambda) {
    var idx = 1;
    var enu = selectorEnum.getEnumerator();

    return Ix.Enumerable.repeat(1)
        .select(function() {
            var a = next(enu);
            var b = next(enu);
            var l = a.length;
            var idx = Math.floor(Math.random() * l);
            var c1 = [];
            var c2 = []

            for (var i = 0; i < l; i++) {
                if (i < idx) {
                    c1[i] = a[i];
                    c2[i] = b[i];
                } else {
                    c2[i] = a[i];
                    c1[i] = b[i];
                }
            return [child, otherChild];
        }).scan(function(a, b) {
            if (idx === 1) {
                return b;
            }
            return a.concat(b);
        }).filter(function() {
            return idx++ === lambda;
        }).select(function(childPopulation) {
            idx = 1;
            return childPopulation;
        });
}

/**
 * Performs two point cross over.
 * @param  {Ix.Enumerable} selectorEnum
 * @return {Ix.Enumerable}
 */
function twoPoint(selectorEnum, lambda) {
    var idx = 1;
    var enu = selectorEnum.getEnumerator();

    return Ix.Enumerable.repeat(1)
        .select(function() {
            var a = next(enu);
            var b = next(enu);
            var l = a.length;
            var idx = Math.floor(Math.random() * l);
            var idx2 = idx + Math.floor(Math.random() * (l - idx));
            var c1 = [];
            var c2 = []

            for (var i = 0; i < l; i++) {
                if (i < idx || i > idx2) {
                    c1[i] = a[i];
                    c2[i] = b[i];
                } else {
                    c2[i] = a[i];
                    c1[i] = b[i];
                }
            return [child, otherChild];
        }).scan(function(a, b) {
            if (idx === 1) {
                return b;
            }
            return a.concat(b);
        }).filter(function() {
            return idx++ === lambda;
        }).select(function(childPopulation) {
            idx = 1;
            return childPopulation;
        });
}

/**
 * Performs an n point cross over.
 * @param  {Ix.Enumerable} selectorEnum
 * @return {Ix.Enumerable}
 */
function nPoint(selectorEnum, lambda) {
    var idx = 1;
    var enu = selectorEnum.getEnumerator();

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
        }).scan(function(a, b) {
            if (idx === 1) {
                return b;
            }
            return a.concat(b);
        }).filter(function() {
            return idx++ === lambda;
        }).select(function(childPopulation) {
            idx = 1;
            return childPopulation;
        });
}
