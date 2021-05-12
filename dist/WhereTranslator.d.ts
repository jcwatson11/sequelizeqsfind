import { Request } from 'express';
import { FindOptions } from 'sequelize';
export declare class WhereTranslator {
    static wheres: {
        [key: string]: any | any[];
        include?: any[];
    };
    static resolveSubWhere(dotRef: string): {
        [key: string]: any;
        include?: any[];
    };
    static setNestedFieldValue(fieldName: string, value: string | string[] | {
        [key: string]: any;
    }[]): void;
    static translate(req: Request, options: FindOptions): FindOptions;
}
