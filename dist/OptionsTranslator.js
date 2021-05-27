"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionsTranslator = void 0;
var OptionsTranslator = /** @class */ (function () {
    function OptionsTranslator() {
    }
    OptionsTranslator.decode = function (jsonString) {
        var buff = Buffer.from(jsonString, 'base64');
        return buff.toString('utf-8');
    };
    OptionsTranslator.hasOptions = function (req) {
        return (req.query.options !== undefined
            || req.body != {});
    };
    OptionsTranslator.translate = function (req) {
        // If there was a body to the GET request,
        // we assume that the body is an options object.
        if (req.method === 'GET' && req.body != {}) {
            return JSON.parse(JSON.stringify(req.body));
        }
        // process raw options from querystring
        if (req.query.options !== undefined) {
            var optsJson = this.decode(req.query.options.toString());
            var options = void 0;
            try {
                options = JSON.parse(optsJson);
            }
            catch (e) {
                throw 'JSON options input could not be parsed properly. ' + e.toString();
            }
            return options;
        }
        return {};
    };
    return OptionsTranslator;
}());
exports.OptionsTranslator = OptionsTranslator;
//# sourceMappingURL=OptionsTranslator.js.map