import {Request} from 'express';
import {FindOptions} from 'sequelize';

export class WithTranslator {
  public static translate(req: Request, options: FindOptions): void {
    // Process with[] array of relation names
    if(req.query.with !== undefined) {
      let w: string[] = []
      if(!Array.isArray(req.query.with)) {
        w.push(req.query.with.toString());
      } else {
        w = <string[]>req.query.with;
      }
      let includes:any[] = [];
      w.forEach((rel, idx, a) => {
        if(rel.indexOf('.') !== -1) {
          let names:string[] = rel.split('.').reverse();
          names.map((val,i,ar) => {
            let n:any = {
              model: val
            };
            if(i!=0) {
              n.include = ar[i-1];
            }
            ar[i] = n;
          });
          includes.push(names.pop());
        } else {
          includes.push({
            model: a[idx]
          });
        }
      });
      options.include = includes;
    }
  }
}

