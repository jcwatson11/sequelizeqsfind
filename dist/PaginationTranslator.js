"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationTranslator = void 0;
var PaginationTranslator = /** @class */ (function () {
    function PaginationTranslator() {
    }
    PaginationTranslator.translate = function (req, options) {
        // Process offset and limit
        options.offset =
            req.query.offset !== undefined ?
                parseInt(req.query.offset.toString())
                : req.query.start !== undefined ?
                    parseInt(req.query.start.toString())
                    : 0;
        options.limit =
            req.query.limit !== undefined ?
                parseInt(req.query.limit.toString())
                : 10;
    };
    return PaginationTranslator;
}());
exports.PaginationTranslator = PaginationTranslator;
//# sourceMappingURL=PaginationTranslator.js.map