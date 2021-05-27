import 'mocha-typescript';
import 'mocha';
import "reflect-metadata";
import {FindOptions} from 'sequelize';
import {expect} from 'chai';
import {Request} from 'express';
import {sequelizeqs} from './sequelizeqs';
const qt = sequelizeqs.TranslateQuery;

describe('With OptionsTranslator,', function() {

  describe('when providing an encoded options json object, it', function() {
    it('can decode and set the options properly', function() {
      let req: any = { query: {}, body: {} } as Request;
      req.query.options = 'eyJvZmZzZXQiOiAwLCJsaW1pdCI6IDEwLCJvcmRlciI6IFtbImZpZWxkMSIsICJERVNDIl1dfQ==';
      let expectedOptions: any = {
        limit: 10
        ,offset:0
        ,order: [
          ["field1","DESC"]
        ]
      } as FindOptions;
      let options: FindOptions = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });

    it('can properly throws an error if the JSON cannot be parsed', function() {
      let req: any = { query: {} } as Request;
      req.query.options = 'eyJvZmZzZXQiOiAwLCJsaW1pdCI6IDEwIm9yZGVyIjogW1siZmllbGQxIiwgIkRFU0MiXV19';
      try {
        qt(req);
      } catch(e) {
        expect(e.toString()).to.equal('JSON options input could not be parsed properly. SyntaxError: Unexpected string in JSON at position 24');
      }
    });

    it('can set options properly from the request body', function() {
      let req: any = { query: {}, body: {} } as Request;
      req.method = 'GET';
      req.body = {
        order: [
           ['field1', 'DESC']
        ]
        ,offset: 0 
        ,limit: 10
      };
      let expectedOptions: any = {
        order: [
           ['field1', 'DESC']
        ]
        ,offset: 0 
        ,limit: 10
      } as FindOptions;
      let options: FindOptions = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });

  });

});

