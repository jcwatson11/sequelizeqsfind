import 'mocha-typescript';
import 'mocha';
import "reflect-metadata";
import {FindOptions} from 'sequelize';
import {expect} from 'chai';
import {Request} from 'express';
import {sequelizeqs} from './sequelizeqs';
const qt = sequelizeqs.TranslateQuery;

describe('With OrderByTranslator,', function() {

  describe('while catching errors, it', function() {
    it('can catch when a field does not have a directional operator', function() {
      let req: any = { query: {} } as Request;
      req.query.orderby = ['field1|FOO','field2'];
      expect(qt.bind(this, req)).to.throw('orderby=field1|FOO does not have a proper directional operator.');
    });
  });

  describe('while processing orderby, it', function() {
    it('can properly set an orderby[]=field1&orderby[]=field2', function() {
      let req: any = { query: {} } as Request;
      req.query.orderby = ['field1','field2'];
      let expectedOptions: any = {
        "limit": 10
        ,"offset": 0
        ,"order": [
          [
            "field1"
            ,"DESC"
          ],[
            "field2"
            ,"DESC"
          ]
        ]
      } as FindOptions;
      let options: FindOptions = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });

    it('can properly set an orderby[]=field1|ASC&orderby[]=field2|ASC', function() {
      let req: any = { query: {} } as Request;
      req.query.orderby = ['field1|ASC','field2|ASC'];
      let expectedOptions: any = {
        "limit": 10
        ,"offset": 0
        ,"order": [
          [
            "field1"
            ,"ASC"
          ],[
            "field2"
            ,"ASC"
          ]
        ]
      } as FindOptions;
      let options: FindOptions = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });

    it('can properly set an orderby[]=field1|DESC&orderby[]=field2|DESC', function() {
      let req: any = { query: {} } as Request;
      req.query.orderby = ['field1|DESC','field2|DESC'];
      let expectedOptions: any = {
        "limit": 10
        ,"offset": 0
        ,"order": [
          [
            "field1"
            ,"DESC"
          ],[
            "field2"
            ,"DESC"
          ]
        ]
      } as FindOptions;
      let options: FindOptions = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });

    it('can properly set an orderby=field1', function() {
      let req: any = { query: {} } as Request;
      req.query.orderby = 'field1';
      let expectedOptions: any = {
        "limit": 10
        ,"offset": 0
        ,"order": [
          [
            "field1"
            ,"DESC"
          ]
        ]
      } as FindOptions;
      let options: FindOptions = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });

    it('can properly set an orderby=field1|ASC', function() {
      let req: any = { query: {} } as Request;
      req.query.orderby = 'field1|ASC';
      let expectedOptions: any = {
        "limit": 10
        ,"offset": 0
        ,"order": [
          [
            "field1"
            ,"ASC"
          ]
        ]
      } as FindOptions;
      let options: FindOptions = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });

    it('can properly set an orderby=field1|DESC', function() {
      let req: any = { query: {} } as Request;
      req.query.orderby = 'field1|DESC';
      let expectedOptions: any = {
        "limit": 10
        ,"offset": 0
        ,"order": [
          [
            "field1"
            ,"DESC"
          ]
        ]
      } as FindOptions;
      let options: FindOptions = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });

    it('can properly set an orderbyField1', function() {
      let req: any = { query: {} } as Request;
      req.query.orderbyField1 = null;
      let expectedOptions: any = {
        "limit": 10
        ,"offset": 0
        ,"order": [
          [
            "Field1"
            ,"DESC"
          ]
        ]
      } as FindOptions;
      let options: FindOptions = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });

    it('can properly set an orderbyField1=ASC', function() {
      let req: any = { query: {} } as Request;
      req.query.orderbyField1 = 'ASC';
      let expectedOptions: any = {
        "limit": 10
        ,"offset": 0
        ,"order": [
          [
            "Field1"
            ,"ASC"
          ]
        ]
      } as FindOptions;
      let options: FindOptions = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });

    it('can properly set an orderbyField1=DESC&orderbyField2=ASC', function() {
      let req: any = { query: {} } as Request;
      req.query.orderbyField1 = 'DESC';
      req.query.orderbyField2 = 'ASC';
      let expectedOptions: any = {
        "limit": 10
        ,"offset": 0
        ,"order": [
          [
            "Field1"
            ,"DESC"
          ],[
            "Field2"
            ,"ASC"
          ]
        ]
      } as FindOptions;
      let options: FindOptions = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });
  });

});

