import 'mocha-typescript';
import 'mocha';
import "reflect-metadata";
import {FindOptions} from 'sequelize';
import {expect} from 'chai';
import {Request} from 'express';
import {sequelizeqs} from './sequelizeqs';
const qt = sequelizeqs.TranslateQuery;

describe('With PaginationTranslator,', function() {

  describe('while processing limit and offset, it', function() {
    it('can properly default the skip and take options', function() {
      let req: any = {query:{}} as Request;
      let expectedOptions: any = {
         "offset": 0
        ,"limit": 10
      } as FindOptions;
      let options: FindOptions = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });

    it('can properly set the skip and take options with limit and offset', function() {
      let req: any = { query: {} } as Request;
      req.query.limit = 20;
      req.query.offset = 40;
      let expectedOptions: any = {
         "offset": 40 
        ,"limit": 20
      } as FindOptions;
      let options: FindOptions = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });

    it('can properly set the skip and take options with offset and limit', function() {
      let req: any = { query: {} } as Request;
      req.query.limit = 20;
      req.query.offset = 40;
      let expectedOptions: any = {
         "offset": 40 
        ,"limit": 20
      } as FindOptions;
      let options: FindOptions = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });
  });

});

