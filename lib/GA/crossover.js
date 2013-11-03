var Ix = require('ix');
var util = require('./../util');
var next = util.next;

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
    var enu = selectorEnum.getEnumerator();
    var selector = Ix.Enumerable.repeat(1)
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
            }
            return [c1, c2];
        });

    return util.selectN(selector, Math.ceil(lambda / 2));
}

/**
 * Performs two point cross over.
 * @param  {Ix.Enumerable} selectorEnum
 * @return {Ix.Enumerable}
 */
function twoPoint(selectorEnum, lambda) {
    var enu = selectorEnum.getEnumerator();


    var selector = Ix.Enumerable.repeat(1)
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
            }
            return [c1, c2];
        });

    return util.selectN(selector, Math.ceil(lambda / 2));
}

/**
 * Performs an n point cross over.
 * @param  {Ix.Enumerable} selectorEnum
 * @return {Ix.Enumerable}
 */
function nPoint(selectorEnum, lambda) {
    var enu = selectorEnum.getEnumerator();
    var selector = Ix.Enumerable.repeat(1)
        .select(function() {
            var a = next(enu);
            var b = next(enu);
            var l = a.length;
            var c1 = [];
            var c2 = [];

            for (var i = 0; i < l; i++) {
                if (Math.random() > 0.499) {
                    c1[i] = a[i];
                    c2[i] = b[i];
                } else {
                    c1[i] = b[i];
                    c2[i] = a[i];
                }
            }
            return [c1, c2];
        });

    return util.selectN(selector, Math.ceil(lambda / 2));
}
