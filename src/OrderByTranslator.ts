import {Request} from 'express';
import {FindOptions,Order,OrderItem} from 'sequelize';

export class OrderByTranslator {
  // Set up some helper functions for orderby
  static catchOrderByFormatError(directionalOperator: string, originalValue: string): void {
    if(directionalOperator !== 'ASC' && directionalOperator !== 'DESC') {
      throw 'orderby='+originalValue+' does not have a proper directional operator.';
    }
  }

  static setSingleOrderBy(name: string, options: FindOptions): void {
    let o:OrderItem;
    let parts: string[] = name.split('|');
    let field:string = parts[0];
    if(parts.length > 1) {
      this.catchOrderByFormatError(parts[1], name);
      o = [field, parts[1]];
    } else {
      o = [field, 'DESC'];
    }
    if(!options.order) {
      options.order = [o];
    } else {
      options.order = [o].concat(<Array<any>>options.order).reverse();
    }
  };

  public static translate(req: Request, options: FindOptions): void {
    // Process orderby[]=Field|DESC syntax
    for(let name in req.query) {
      let orderbyMatcher = /^orderby$/;
      if(name.match(orderbyMatcher)) {
        if(Array.isArray(req.query[name])) {
          for(let i:number=0;i<req.query[name].length;i++) {
            let fieldname: string = req.query[name][i].toString();
            this.setSingleOrderBy(fieldname, options);
          }
        } else {
          let fieldname: string = req.query.orderby.toString();
          this.setSingleOrderBy(fieldname, options);
        }
      }

      // Process orderbyFieldname=DESC syntax
      let obMatcher = /^orderby.+/;
      if(name.match(obMatcher)) {
        let fieldname: string = name.replace(/^orderby/,'');
        let direction: string = (req.query[name]) ? req.query[name].toString():'DESC';
        this.setSingleOrderBy(fieldname + '|' + direction, options);
      }
    }
  }
}

