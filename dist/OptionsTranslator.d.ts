import { Request } from 'express';
import { FindOptions } from 'sequelize';
export declare class OptionsTranslator {
    static decode(jsonString: string): string;
    static hasOptions(req: Request): boolean;
    static translate(req: Request): FindOptions;
}
