import { Request } from 'express';
import { FindOptions } from 'sequelize';
export declare class sequelizeqs {
    static TranslateQuery(req: Request): FindOptions;
}
export { OperatorAliases } from './OperatorAliases';
