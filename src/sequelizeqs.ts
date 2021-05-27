import {Request} from 'express';
import {WithTranslator} from './WithTranslator';
import {WhereTranslator} from './WhereTranslator';
import {PaginationTranslator} from './PaginationTranslator';
import {OrderByTranslator} from './OrderByTranslator';
import {OptionsTranslator} from './OptionsTranslator';
import {FindOptions} from 'sequelize';

export class sequelizeqs {
  public static TranslateQuery(req: Request): FindOptions  {
    var options: FindOptions = {} as FindOptions;

    // Apply the options object from the querystring
    // or the body first. Then other querystring parameters
    // can be applied to modify it or add to it.
    if(OptionsTranslator.hasOptions(req)) {
      options = OptionsTranslator.translate(req);
    }

    // Process pagination
    PaginationTranslator.translate(req, options);

    // Add relations
    WithTranslator.translate(req, options);

    // Order the results
    OrderByTranslator.translate(req, options);

    // Process where clauses
    options = WhereTranslator.translate(req, options);

    // Return options
    return options as FindOptions;
  }
};

export {OperatorAliases} from './OperatorAliases';
