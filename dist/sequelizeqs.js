"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelizeqs = void 0;
var WithTranslator_1 = require("./WithTranslator");
var WhereTranslator_1 = require("./WhereTranslator");
var PaginationTranslator_1 = require("./PaginationTranslator");
var OrderByTranslator_1 = require("./OrderByTranslator");
var OptionsTranslator_1 = require("./OptionsTranslator");
var sequelizeqs = /** @class */ (function () {
    function sequelizeqs() {
    }
    sequelizeqs.TranslateQuery = function (req) {
        var options = {};
        // Apply the options object from the querystring
        // or the body first. Then other querystring parameters
        // can be applied to modify it or add to it.
        if (OptionsTranslator_1.OptionsTranslator.hasOptions(req)) {
            options = OptionsTranslator_1.OptionsTranslator.translate(req);
        }
        // Process pagination
        PaginationTranslator_1.PaginationTranslator.translate(req, options);
        // Add relations
        WithTranslator_1.WithTranslator.translate(req, options);
        // Order the results
        OrderByTranslator_1.OrderByTranslator.translate(req, options);
        // Process where clauses
        options = WhereTranslator_1.WhereTranslator.translate(req, options);
        // Return options
        return options;
    };
    return sequelizeqs;
}());
exports.sequelizeqs = sequelizeqs;
//# sourceMappingURL=sequelizeqs.js.map