import { Request } from 'express';
import { FindManyOptions } from 'typeorm';
export declare const uniqueFilter: (v: string, i: number, a: any) => boolean;
export declare class OrderByTranslator {
    static catchOrderByFormatError(directionalOperator: string, originalValue: string): void;
    static setSingleOrderBy(name: string, options: FindManyOptions): void;
    static translate(req: Request, options: FindManyOptions): void;
}
