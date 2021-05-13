"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithTranslator = void 0;
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
            var includes_1 = [];
            w.forEach(function (rel, idx, a) {
                if (rel.indexOf('.') !== -1) {
                    var names = rel.split('.').reverse();
                    names.map(function (val, i, ar) {
                        var n = {
                            association: val
                        };
                        if (i != 0) {
                            n.include = ar[i - 1];
                        }
                        ar[i] = n;
                    });
                    includes_1.push(names.pop());
                }
                else {
                    includes_1.push({
                        association: a[idx]
                    });
                }
            });
            options.include = includes_1;
        }
    };
    return WithTranslator;
}());
exports.WithTranslator = WithTranslator;
//# sourceMappingURL=WithTranslator.js.map