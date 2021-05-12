"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhereTranslator = void 0;
var sequelize_1 = require("sequelize");
var WhereTranslator = /** @class */ (function () {
    function WhereTranslator() {
    }
    WhereTranslator.resolveSubWhere = function (dotRef) {
        var where = this.wheres;
        var fields = dotRef.split('.');
        fields.map(function (field) {
            if (where.include !== undefined) {
                var inc_1 = where.include.find(function (item) {
                    return item.model && item.model == field;
                });
                if (inc_1) {
                    where = inc_1;
                }
                else {
                    inc_1 = { model: field };
                    where.include.push(inc_1);
                    where = inc_1;
                }
            }
            else {
                var inc = { model: field };
                where.include = [inc];
                where = inc;
            }
        });
        return where;
    };
    WhereTranslator.setNestedFieldValue = function (fieldName, value) {
        var _a, _b;
        if (fieldName.indexOf('.') !== -1) {
            var pathParts = fieldName.split('.');
            var targetField = pathParts.pop();
            var clause = this.resolveSubWhere(pathParts.join('.'));
            clause.where = (_a = {}, _a[targetField] = value, _a);
        }
        else {
            this.wheres.where = __assign(__assign({}, this.wheres.where), (_b = {}, _b[fieldName] = value, _b));
        }
    };
    WhereTranslator.translate = function (req, options) {
        // Begin processing WHERE options
        this.wheres = {};
        // Loop through request looking for where-type operators
        for (var name_1 in req.query) {
            // Process whereField
            var Or = function (val) {
                var _a;
                return _a = {},
                    _a[sequelize_1.Op.or] = val,
                    _a;
            };
            if (name_1.indexOf('orwhere') === 0) {
                var fieldName = name_1.replace(/^orwhere/, '');
                var value = req.query[name_1].map(function (value) { return value.toString(); });
                this.setNestedFieldValue(fieldName, Or(value));
            }
            // Process whereField
            if (name_1.indexOf('where') === 0) {
                var fieldName = name_1.replace(/^where/, '');
                var value = req.query[name_1].toString();
                this.setNestedFieldValue(fieldName, value);
            }
            var In = function (val) {
                var _a;
                return _a = {},
                    _a[sequelize_1.Op.in] = val,
                    _a;
            };
            // Process inarrayField
            if (name_1.indexOf('inarray') === 0) {
                var fieldName = name_1.replace(/^inarray/, '');
                var value = req.query[name_1].map(function (value) { return value.toString(); });
                this.setNestedFieldValue(fieldName, In(value));
            }
            var NotIn = function (val) {
                var _a;
                return _a = {},
                    _a[sequelize_1.Op.notIn] = val,
                    _a;
            };
            // Process notinarrayField
            if (name_1.indexOf('notinarray') === 0) {
                var fieldName = name_1.replace(/^notinarray/, '');
                var value = req.query[name_1].map(function (value) { return value.toString(); });
                this.setNestedFieldValue(fieldName, NotIn(value));
            }
            var IsNull = function () {
                var _a;
                return _a = {},
                    _a[sequelize_1.Op.is] = null,
                    _a;
            };
            // Process isnullField
            if (name_1.indexOf('isnull') === 0) {
                var fieldName = name_1.replace(/^isnull/, '');
                this.setNestedFieldValue(fieldName, IsNull());
            }
            var NotNull = function () {
                var _a;
                return _a = {},
                    _a[sequelize_1.Op.not] = null,
                    _a;
            };
            // Process isnullField
            if (name_1.indexOf('isnotnull') === 0) {
                var fieldName = name_1.replace(/^isnotnull/, '');
                this.setNestedFieldValue(fieldName, NotNull());
            }
            var Between = function (val1, val2) {
                var _a;
                return _a = {},
                    _a[sequelize_1.Op.between] = [val1, val2],
                    _a;
            };
            // Process betweenField
            if (name_1.indexOf('between') === 0) {
                var fieldName = name_1.replace(/^between/, '');
                var value = req.query[name_1].map(function (value) { return value.toString(); });
                this.setNestedFieldValue(fieldName, Between(value[0], value[1]));
            }
            var Like = function (val) {
                var _a;
                return _a = {},
                    _a[sequelize_1.Op.like] = val,
                    _a;
            };
            // Process likeField
            if (name_1.indexOf('like') === 0) {
                var fieldName = name_1.replace(/^like/, '');
                var value = req.query[name_1].toString();
                this.setNestedFieldValue(fieldName, Like(value));
            }
            var ILike = function (val) {
                var _a;
                return _a = {},
                    _a[sequelize_1.Op.iLike] = val,
                    _a;
            };
            // Process likeField
            if (name_1.indexOf('ilike') === 0) {
                var fieldName = name_1.replace(/^ilike/, '');
                var value = req.query[name_1].toString();
                this.setNestedFieldValue(fieldName, ILike(value));
            }
            var MoreThan = function (val) {
                var _a;
                return _a = {},
                    _a[sequelize_1.Op.gt] = val,
                    _a;
            };
            // Process greaterthanField
            var gtMatcher = /^greaterthan(?!orequalto)/;
            if (name_1.match(gtMatcher)) {
                var fieldName = name_1.replace(gtMatcher, '');
                var value = parseInt(req.query[name_1].toString());
                this.setNestedFieldValue(fieldName, MoreThan(value));
            }
            var MoreThanOrEqual = function (val) {
                var _a;
                return _a = {},
                    _a[sequelize_1.Op.gte] = val,
                    _a;
            };
            // Process greaterthanorequaltoField
            var gteMatcher = /^greaterthanorequalto/;
            if (name_1.match(gteMatcher)) {
                var fieldName = name_1.replace(gteMatcher, '');
                var value = parseInt(req.query[name_1].toString());
                this.setNestedFieldValue(fieldName, MoreThanOrEqual(value));
            }
            var LessThan = function (val) {
                var _a;
                return _a = {},
                    _a[sequelize_1.Op.lt] = val,
                    _a;
            };
            // Process lessthanField
            var ltMatcher = /^lessthan(?!orequalto)/;
            if (name_1.match(ltMatcher)) {
                var fieldName = name_1.replace(ltMatcher, '');
                var value = parseInt(req.query[name_1].toString());
                this.setNestedFieldValue(fieldName, LessThan(value));
            }
            var LessThanOrEqual = function (val) {
                var _a;
                return _a = {},
                    _a[sequelize_1.Op.lte] = val,
                    _a;
            };
            // Process lessthanorequaltoField
            var lteMatcher = /^lessthanorequalto/;
            if (name_1.match(lteMatcher)) {
                var fieldName = name_1.replace(lteMatcher, '');
                var value = parseInt(req.query[name_1].toString());
                this.setNestedFieldValue(fieldName, LessThanOrEqual(value));
            }
        }
        // Set the wheres
        if (Object.keys(this.wheres).length !== 0) {
            var fo = __assign(__assign({}, options), this.wheres);
            return fo;
        }
        else {
            return options;
        }
    };
    // Set up some helper functions for orderBy
    //
    WhereTranslator.wheres = {};
    return WhereTranslator;
}());
exports.WhereTranslator = WhereTranslator;
//# sourceMappingURL=WhereTranslator.js.map