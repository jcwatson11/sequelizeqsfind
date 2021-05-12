import { Request } from 'express';
import { FindOptions } from 'sequelize';
export declare class OrderByTranslator {
    static catchOrderByFormatError(directionalOperator: string, originalValue: string): void;
    static setSingleOrderBy(name: string, options: FindOptions): void;
    static translate(req: Request, options: FindOptions): void;
}
