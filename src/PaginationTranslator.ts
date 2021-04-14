import {Request} from 'express';
import {FindOptions} from 'sequelize';

export class PaginationTranslator {
  public static translate(req: Request, options: FindOptions): void {
    // Process offset and limit
    options.offset =
      req.query.offset !== undefined ?
      parseInt(req.query.offset.toString())
      : req.query.start !== undefined ?
      parseInt(req.query.start.toString())
      : 0;
    options.limit =
      req.query.limit !== undefined ?
      parseInt(req.query.limit.toString())
      : 10;

  }
}

