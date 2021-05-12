import { Request } from 'express';
import { FindOptions } from 'sequelize';
export declare class WithTranslator {
    static translate(req: Request, options: FindOptions): void;
}
