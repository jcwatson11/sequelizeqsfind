"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithTranslator = exports.uniqueFilter = void 0;
exports.uniqueFilter = function (v, i, a) {
    return a.indexOf(v) === i;
};
var WithTranslator = /** @class */ (function () {
    function WithTranslator() {
    }
    WithTranslator.translate = function (req, options) {
        // Process with[] array of relation names
        if (req.query.with !== undefined) {
            var w = [];
            if (!Array.isArray(req.query.with)) {
                w.push(req.query.with.toString());
            }
            else {
                w = req.query.with;
            }
            w.forEach(function (rel, idx, a) {
                var nested = [];
                if (rel.indexOf('.') !== -1) {
                    var item = a.splice(idx, 1)[0];
                    var parts = item.split('.');
                    var cumulativeRelation = [];
                    var part = '';
                    while (part = parts.shift()) {
                        cumulativeRelation.push(part);
                        nested.push(cumulativeRelation.join('.'));
                    }
                }
                a.splice.apply(a, __spreadArrays([idx, 0], nested));
            });
            w = w.filter(exports.uniqueFilter);
            options.relations = w;
        }
    };
    return WithTranslator;
}());
exports.WithTranslator = WithTranslator;
//# sourceMappingURL=WithTranslator.js.map