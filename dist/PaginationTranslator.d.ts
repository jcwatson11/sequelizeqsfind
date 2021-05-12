import { Request } from 'express';
import { FindOptions } from 'sequelize';
export declare class PaginationTranslator {
    static translate(req: Request, options: FindOptions): void;
}
