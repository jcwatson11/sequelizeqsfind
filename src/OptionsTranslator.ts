import {Request} from 'express';
import {FindOptions} from 'sequelize';

export class OptionsTranslator {

  public static decode(jsonString: string): string {
    let buff: Buffer = Buffer.from(jsonString,'base64');
    return buff.toString('utf-8');
  }

  public static hasOptions(req: Request): boolean {
    return (
      req.query.options !== undefined
      || req.body != {}
    );
  }

  public static translate(req: Request): FindOptions {

    // If there was a body to the GET request,
    // we assume that the body is an options object.
    if(req.method === 'GET' && req.body != {}) {
      return JSON.parse(JSON.stringify(req.body)) as FindOptions;
    }
    // process raw options from querystring
    if(req.query.options !== undefined) {
      let optsJson: any = this.decode(req.query.options.toString());
      let options: FindOptions;
      try {
        options = JSON.parse(optsJson) as FindOptions;
      } catch(e) {
        throw 'JSON options input could not be parsed properly. ' + e.toString();
      }
      return options as FindOptions;
    }
    return {} as FindOptions;
  }
}

