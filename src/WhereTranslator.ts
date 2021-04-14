import {Request} from 'express';
import {FindOptions,Op} from 'sequelize';

export class WhereTranslator {
  // Set up some helper functions for orderBy
  //
  public static wheres: {[key: string]: any|any[], include?:any[] } = {};

  public static resolveSubWhere(dotRef:string) {
    let where = this.wheres;
    let fields:string[] = dotRef.split('.')
    fields.map((field) => {
      if(where.include !== undefined) {
        let inc:any = where.include.find((item) => {
          return item.model && item.model == field;
        });
        if(inc) {
          where = inc;
        } else {
          inc = {model:field};
          where.include.push(inc);
          where = inc;
        }
      } else {
        var inc:any = {model:field};
        where.include = [inc];
        where = inc;
      }
    });
    return where;
  }

  public static setNestedFieldValue(fieldName: string, value: string | string[] | {[key: string]: any}[]) {
    if(fieldName.indexOf('.') !== -1) {
        let pathParts:string[] = fieldName.split('.');
        let targetField: string = pathParts.pop();
        let clause:any = this.resolveSubWhere(pathParts.join('.'));
        clause.where = {[targetField]:value};
    } else {
      this.wheres.where = {...this.wheres.where,[fieldName]:value};
    }
  }

  public static translate(req: Request, options: FindOptions): FindOptions {
    // Begin processing WHERE options
    this.wheres = {};

    // Loop through request looking for where-type operators
    for(let name in req.query) {
      // Process whereField
      const Or = (val:any[]):any => {
        return {
          [Op.or]: val
        }
      }
      if(name.indexOf('orwhere') === 0) {
        let fieldName: string = name.replace(/^orwhere/,'');
        let value: string[] = (<string[]>req.query[name]).map(value => value.toString());
        this.setNestedFieldValue(fieldName, Or(value));
      }

      // Process whereField
      if(name.indexOf('where') === 0) {
        let fieldName: string = name.replace(/^where/,'');
        let value: string = req.query[name].toString();
        this.setNestedFieldValue(fieldName, value);
      }

      const In = (val:any[]):any => {
        return {
          [Op.in]: val
        }
      }
      // Process inarrayField
      if(name.indexOf('inarray') === 0) {
        let fieldName: string = name.replace(/^inarray/,'');
        let value: string[] = (<string[]>req.query[name]).map(value => value.toString());
        this.setNestedFieldValue(fieldName, In(value));
      }

      const NotIn = (val:any[]):any => {
        return {
          [Op.notIn]: val
        }
      }
      // Process notinarrayField
      if(name.indexOf('notinarray') === 0) {
        let fieldName: string = name.replace(/^notinarray/,'');
        let value: string[] = (<string[]>req.query[name]).map(value => value.toString());
        this.setNestedFieldValue(fieldName, NotIn(value));
      }

      const IsNull = ():any => {
        return {
          [Op.is]: null
        }
      }
      // Process isnullField
      if(name.indexOf('isnull') === 0) {
        let fieldName: string = name.replace(/^isnull/,'');
        this.setNestedFieldValue(fieldName, IsNull());
      }

      const NotNull = ():any => {
        return {
          [Op.not]: null
        }
      }
      // Process isnullField
      if(name.indexOf('isnotnull') === 0) {
        let fieldName: string = name.replace(/^isnotnull/,'');
        this.setNestedFieldValue(fieldName, NotNull());
      }

      const Between = (val1:any, val2:any):any => {
        return {
          [Op.between]: [val1, val2]
        }
      }
      // Process betweenField
      if(name.indexOf('between') === 0) {
        let fieldName: string = name.replace(/^between/,'');
        let value: string[] = (<string[]>req.query[name]).map(value => value.toString());
        this.setNestedFieldValue(fieldName, Between(value[0], value[1]));
      }

      const Like = (val:any):any => {
        return {
          [Op.like]: val
        }
      }
      // Process likeField
      if(name.indexOf('like') === 0) {
        let fieldName: string = name.replace(/^like/,'');
        let value: string = req.query[name].toString();
        this.setNestedFieldValue(fieldName, Like(value));
      }

      const ILike = (val:any):any => {
        return {
          [Op.iLike]: val
        }
      }
      // Process likeField
      if(name.indexOf('ilike') === 0) {
        let fieldName: string = name.replace(/^ilike/,'');
        let value: string = req.query[name].toString();
        this.setNestedFieldValue(fieldName, ILike(value));
      }

      const MoreThan = (val:number):any => {
        return {
          [Op.gt]: val
        }
      }
      // Process greaterthanField
      let gtMatcher = /^greaterthan(?!orequalto)/;
      if(name.match(gtMatcher)) {
        let fieldName: string = name.replace(gtMatcher,'');
        let value:number = parseInt(req.query[name].toString());
        this.setNestedFieldValue(fieldName, MoreThan(value));
      }

      const MoreThanOrEqual = (val:number):any => {
        return {
          [Op.gte]: val
        }
      }
      // Process greaterthanorequaltoField
      let gteMatcher = /^greaterthanorequalto/;
      if(name.match(gteMatcher)) {
        let fieldName: string = name.replace(gteMatcher,'');
        let value: number = parseInt(req.query[name].toString());
        this.setNestedFieldValue(fieldName, MoreThanOrEqual(value));
      }

      const LessThan = (val:number):any => {
        return {
          [Op.lt]: val
        }
      }
      // Process lessthanField
      let ltMatcher = /^lessthan(?!orequalto)/;
      if(name.match(ltMatcher)) {
        let fieldName: string = name.replace(ltMatcher,'');
        let value: number = parseInt(req.query[name].toString());
        this.setNestedFieldValue(fieldName, LessThan(value));
      }

      const LessThanOrEqual = (val:number):any => {
        return {
          [Op.lte]: val
        }
      }
      // Process lessthanorequaltoField
      let lteMatcher = /^lessthanorequalto/;
      if(name.match(lteMatcher)) {
        let fieldName: string = name.replace(lteMatcher,'');
        let value: number = parseInt(req.query[name].toString());
        this.setNestedFieldValue(fieldName, LessThanOrEqual(value));
      }

    }

    // Set the wheres
    if(Object.keys(this.wheres).length !== 0) {
      let fo:FindOptions = {...options,...this.wheres};
      return fo;
    } else {
      return options;
    }
  }
}

