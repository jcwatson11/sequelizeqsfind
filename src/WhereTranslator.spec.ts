import 'mocha-typescript';
import 'mocha';
import "reflect-metadata";
import {FindOptions,Op} from 'sequelize';
import {expect} from 'chai';
import {Request} from 'express';
import {sequelizeqs} from './sequelizeqs';
import {WhereTranslator} from './WhereTranslator';
const qt = sequelizeqs.TranslateQuery;

describe('With WhereTranslator,', function() {

  describe('when processing sub relation references', function() {
    it('it can resolve a sub relation',function() {
      let w:any = {
        include: [{
          model: "Alternate"
          ,include: [{
            model: "MergedWith"
            ,include: [{
              model: "Alternate"
              ,where: {
                Name: "Julie"
              }
            }]
          }]
        }]
      };
      WhereTranslator.wheres = w;

      let expected:any = {
        model: "Alternate"
        ,where: {
          Name: "Julie"
        }
      };
      let actual:any = WhereTranslator.resolveSubWhere('Alternate.MergedWith.Alternate');
      expect(actual).to.deep.equal(expected);
      expect(WhereTranslator.wheres).to.deep.equal(w);
    })

    it('it can set nested field values', function() {
      let expected:any = {
        include: [{
          model: "Alternate"
          ,include: [{
            model: "MergedWith"
            ,include: [{
              model: "Alternate"
              ,where: {
                Name: "Julie"
              }
            }]
          }]
        }]
      };
      WhereTranslator.setNestedFieldValue('Alternate.MergedWith.Alternate.Name','Julie');
      expect(WhereTranslator.wheres).to.deep.equal(expected);
    });
  })
  describe('when processing where, it', function() {
    it('can set the where clause properly', function() {
      let req: any = { query: {} } as Request;
      req.query.whereField1 = 'val1';
      let expectedOptions: any = {
        "limit": 10
        ,"offset": 0
        ,"where": {
          "Field1": "val1"
        }
      } as FindOptions;
      let options: FindOptions = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });

    it('can set the orWhere clause properly', function() {
      let req: any = { query: {} } as Request;
      req.query.orwhereField1 = ['val1','val2'];
      let expectedOptions: any = {
        limit: 10
        ,offset: 0
        ,where: {
          Field1: {[Op.or]: ['val1','val2']}
        }
      } as FindOptions;
      let options: FindOptions = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });

    it('can set the nested where clause properly', function() {
      let req: any = { query: {} } as Request;
      req.query['whereAlternate.Field1'] = 'val1';
      let expectedOptions: any = {
        limit: 10
        ,offset: 0
        ,include: [{
          model: "Alternate"
          ,where: {
            Field1: "val1"
          }
        }]
      } as FindOptions;
      let options: FindOptions = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });

    it('can set the nested where clause properly to the 5th level', function() {
      let req: any = { query: {} } as Request;
      req.query['whereAlternate.MergedWith.Alternate.Person.Field1'] = 'val1';
      let expectedOptions: any = {
        limit: 10
        ,offset: 0
        ,include: [{
          model: "Alternate"
          ,include: [{
            model: "MergedWith"
            ,include: [{
              model: "Alternate"
              ,include: [{
                model: "Person"
                ,where: {
                  Field1: "val1"
                }
              }]
            }]
          }]
        }]
      } as FindOptions;
      let options: FindOptions = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });
  });

  describe('when processing inarray and notinarray, it', function() {
    it('can set the where clause properly with an array of values', function() {
      let req: any = { query: {} } as Request;
      req.query.inarrayField1 = ['val1', 'val2'];
      let expectedOptions: any = {
        limit: 10
        ,offset: 0
        ,where: {
          Field1: {[Op.in]: ['val1','val2']}
        }
      } as FindOptions;
      expectedOptions = expectedOptions;
      let options: any = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });

    it('can set the nested inarray clause properly', function() {
      let req: any = { query: {} } as Request;
      req.query['inarrayAlternate.Field1'] = ['val1','val2'];
      let expectedOptions: any = {
        offset: 0
        ,limit: 10
        ,include: [{
          model: "Alternate"
          ,where: {
            Field1: {[Op.in]: ['val1','val2']}
          }
        }]
      } as FindOptions;
      expectedOptions = expectedOptions;
      let options: any = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });

    it('can set the nested inarray clause properly to the 5th level', function() {
      let req: any = { query: {} } as Request;
      req.query['inarrayAlternate.MergedWith.Alternate.Person.Field1'] = ['val1','val2'];
      let expectedOptions: any = {
        limit: 10
        ,offset: 0
        ,include: [{
          model: "Alternate"
          ,include: [{
            model: "MergedWith"
            ,include: [{
              model: "Alternate"
              ,include: [{
                model: "Person"
                ,where: {
                  Field1: {[Op.in]: ['val1','val2']}
                }
              }]
            }]
          }]
        }]
      } as FindOptions;
      expectedOptions = expectedOptions;
      let options: any = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });

    it('can set the nested notinarray clause properly', function() {
      let req: any = { query: {} } as Request;
      req.query['notinarrayAlternate.MergedWith.Field1'] = ['val1','val2'];
      let expectedOptions: any = {
        offset: 0
        ,limit: 10
        ,include: [{
          model: "Alternate"
          ,include: [{
            model: "MergedWith"
            ,where: {
              Field1: {[Op.notIn]: ['val1','val2']}
            }
          }]
        }]
      } as FindOptions;
      expectedOptions = expectedOptions;
      let options: any = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });
  });

  describe('when processing isnull, it', function() {
    it('can set the options properly for finding null values', function() {
      let req: any = { query: {} } as Request;
      req.query['isnullAlternate.Person.Field1'] = null;
      let expectedOptions: any = {
        offset: 0
        ,limit: 10
        ,include: [{
          model: "Alternate"
          ,include: [{
            model: "Person"
            ,where: {
              Field1: {[Op.is]: null}
            }
          }]
        }]
      } as FindOptions;
      expectedOptions = expectedOptions;
      let options: any = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });
  });

  describe('when processing isnotnull, it', function() {
    it('can set the options properly for finding notnull values', function() {
      let req: any = { query: {} } as Request;
      req.query['isnotnullAlternate.Person.Field1'] = null;
      let expectedOptions: any = {
        offset: 0
        ,limit: 10
        ,include: [{
          model: "Alternate"
          ,include: [{
            model: "Person"
            ,where: {
              Field1: {[Op.not]: null}
            }
          }]
        }]
      } as FindOptions;
      expectedOptions = expectedOptions;
      let options: any = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });
  });

  describe('when processing between, it', function() {
    it('can set the options properly for finding between values', function() {
      let req: any = { query: {} } as Request;
      req.query['betweenAlternate.Person.DateField'] = ["2010-01-20","2020-01-20"];
      let expectedOptions: any = {
        offset: 0
        ,limit: 10
        ,include: [{
          model: "Alternate"
          ,include: [{
            model: "Person"
            ,where: {
              DateField: {[Op.between]: ["2010-01-20","2020-01-20"]}
            }
          }]
        }]
      } as FindOptions;
      expectedOptions = expectedOptions;
      let options: any = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });
  });

  describe('when processing like and ilike, it', function() {
    it('can properly URI decod wild card characters coming from the client', function() {
      let req: any = { query: {} } as Request;
      req.query['likeAlternate.Person.StringField'] = "%25name%25";
      let expectedOptions: any = {
        offset: 0
        ,limit: 10
        ,include: [{
          model: "Alternate"
          ,include: [{
            model: "Person"
            ,where: {
              StringField: {[Op.like]: "%name%"}
            }
          }]
        }]
      } as FindOptions;
      expectedOptions = expectedOptions;
      let options: any = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });

    it('can set the options properly for finding like values', function() {
      let req: any = { query: {} } as Request;
      req.query['likeAlternate.Person.StringField'] = "%name%";
      let expectedOptions: any = {
        offset: 0
        ,limit: 10
        ,include: [{
          model: "Alternate"
          ,include: [{
            model: "Person"
            ,where: {
              StringField: {[Op.like]: "%name%"}
            }
          }]
        }]
      } as FindOptions;
      expectedOptions = expectedOptions;
      let options: any = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });

    it('can set the options properly for finding ilike values', function() {
      let req: any = { query: {} } as Request;
      req.query['ilikeAlternate.Person.StringField'] = "%name%";
      let expectedOptions: any = {
        offset: 0
        ,limit: 10
        ,include: [{
          model: "Alternate"
          ,include: [{
            model: "Person"
            ,where: {
              StringField: {[Op.iLike]: "%name%"}
            }
          }]
        }]
      } as FindOptions;
      expectedOptions = expectedOptions;
      let options: any = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });
  });

  describe('when processing greaterthan and less than operators, it', function() {
    it('can set the options properly for finding greater than', function() {
      let req: any = { query: {} } as Request;
      req.query['greaterthanAlternate.Person.NumberField'] = 4;
      let expectedOptions: any = {
        offset: 0
        ,limit: 10
        ,include: [{
          model: "Alternate"
          ,include: [{
            model: "Person"
            ,where: {
              NumberField: {[Op.gt]: 4}
            }
          }]
        }]
      } as FindOptions;
      expectedOptions = expectedOptions;
      let options: any = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });

    it('can set the options properly for finding greater than or equal to', function() {
      let req: any = { query: {} } as Request;
      req.query['greaterthanorequaltoAlternate.Person.NumberField'] = 4;
      let expectedOptions: any = {
        offset: 0
        ,limit: 10
        ,include: [{
          model: "Alternate"
          ,include: [{
            model: "Person"
            ,where: {
              NumberField: {[Op.gte]: 4}
            }
          }]
        }]
      } as FindOptions;
      expectedOptions = expectedOptions;
      let options: any = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });

    it('can set the options properly for finding less than', function() {
      let req: any = { query: {} } as Request;
      req.query['lessthanAlternate.Person.NumberField'] = 4;
      let expectedOptions: any = {
        offset: 0
        ,limit: 10
        ,include: [{
          model: "Alternate"
          ,include: [{
            model: "Person"
            ,where: {
              NumberField: {[Op.lt]: 4}
            }
          }]
        }]
      } as FindOptions;
      expectedOptions = expectedOptions;
      let options: any = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });

    it('can set the options properly for finding less than or equal to', function() {
      let req: any = { query: {} } as Request;
      req.query['lessthanorequaltoAlternate.Person.NumberField'] = 4;
      let expectedOptions: any = {
        offset: 0
        ,limit: 10
        ,include: [{
          model: "Alternate"
          ,include: [{
            model: "Person"
            ,where: {
              NumberField: {[Op.lte]: 4}
            }
          }]
        }]
      } as FindOptions;
      expectedOptions = expectedOptions;
      let options: any = qt(req);
      expect(options).to.deep.equal(expectedOptions);
    });

  });

});

