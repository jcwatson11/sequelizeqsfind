"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderByTranslator = void 0;
var OrderByTranslator = /** @class */ (function () {
    function OrderByTranslator() {
    }
    // Set up some helper functions for orderby
    OrderByTranslator.catchOrderByFormatError = function (directionalOperator, originalValue) {
        if (directionalOperator !== 'ASC' && directionalOperator !== 'DESC') {
            throw 'orderby=' + originalValue + ' does not have a proper directional operator.';
        }
    };
    OrderByTranslator.setSingleOrderBy = function (name, options) {
        var o;
        var parts = name.split('|');
        var field = parts[0];
        if (parts.length > 1) {
            this.catchOrderByFormatError(parts[1], name);
            o = [field, parts[1]];
        }
        else {
            o = [field, 'DESC'];
        }
        if (!options.order) {
            options.order = [o];
        }
        else {
            options.order = [o].concat(options.order).reverse();
        }
    };
    ;
    OrderByTranslator.translate = function (req, options) {
        // Process orderby[]=Field|DESC syntax
        for (var name_1 in req.query) {
            var orderbyMatcher = /^orderby$/;
            if (name_1.match(orderbyMatcher)) {
                if (Array.isArray(req.query[name_1])) {
                    for (var i = 0; i < req.query[name_1].length; i++) {
                        var fieldname = req.query[name_1][i].toString();
                        this.setSingleOrderBy(fieldname, options);
                    }
                }
                else {
                    var fieldname = req.query.orderby.toString();
                    this.setSingleOrderBy(fieldname, options);
                }
            }
            // Process orderbyFieldname=DESC syntax
            var obMatcher = /^orderby.+/;
            if (name_1.match(obMatcher)) {
                var fieldname = name_1.replace(/^orderby/, '');
                var direction = (req.query[name_1]) ? req.query[name_1].toString() : 'DESC';
                this.setSingleOrderBy(fieldname + '|' + direction, options);
            }
        }
    };
    return OrderByTranslator;
}());
exports.OrderByTranslator = OrderByTranslator;
//# sourceMappingURL=OrderByTranslator.js.map