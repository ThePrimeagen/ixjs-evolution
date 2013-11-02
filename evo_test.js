var nPoint = require('./lib/crossover').nPoint;
var util = require('./lib/util');

var base = [];
for (var i = 0; i < 5; i++) {
    var r = [];
    for (var j = 0; j < 5; j++) {
        r.push(Math.floor(Math.random() * 100));
    }
    base.push(r);
}

var selector = util.sequentialValue(base);
var xOver = nPoint(selector, 3).getEnumerator();


for (var i = 0; i < 3; i++) {
    var res = util.next(xOver);
}