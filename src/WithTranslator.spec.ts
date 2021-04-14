import 'mocha-typescript';
import 'mocha';
import "reflect-metadata";
import {FindOptions} from 'sequelize';
import {expect} from 'chai';
import {Request} from 'express';
import {sequelizeqs} from './sequelizeqs';
const qt = sequelizeqs.TranslateQuery;

describe('With WithTranslator,', function() {

  describe('if the with parameter is not an array, it', function() {
    it('can properly try to assimilate it into the find options', function() {
      let req: any = {query:{}} as Request;
      let expectedOptions: any = {
        "offset": 0
        ,"limit": 10
        ,"include": [{
          "model": "Alternate"
        }]
      } as FindOptions;
      req.query.with = 'Alternate';
      let options: FindOptions = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });
  });

  describe('while parsing with[], it', function() {
    it('can properly translate singular relation requests', function() {
      let req: any = {query:{}} as Request;
      let expectedOptions: any = {
        "include": [
          {model:"Alternate"}
          ,{model:"MergedWith"}
        ]
        ,"offset": 0
        ,"limit": 10
      } as FindOptions;
      req.query.with = ['Alternate','MergedWith'];
      let options: FindOptions = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });

    it('can properly translate nested relation requests', function() {
      let req: any = {query:{}} as Request;
      let expectedOptions: any = {
         "include": [
           {
             "model": "Alternate"
             ,"include": {
               "model": "MergedWith"
               ,"include": {
                 "model": "Person"
               }
             }
           }
           ,{
             "model": "Secondary"
           }
         ]
         ,"limit": 10
         ,"offset": 0
       } as FindOptions;
      req.query.with = ['Alternate.MergedWith.Person','Secondary'];
      let options: FindOptions = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });
  });

});

