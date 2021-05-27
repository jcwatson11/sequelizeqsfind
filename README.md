![GitHub Workflow Status](https://img.shields.io/github/workflow/status/jcwatson11/sequelizeqsfind/CI)
![Travis (.com)](https://img.shields.io/travis/com/jcwatson11/sequelizeqsfind)
[![Coverage Status](https://coveralls.io/repos/jcwatson11/sequelizeqsfind/badge.svg?branch=main)](https://coveralls.io/r/jcwatson11/sequelizeqsfind?branch=main)

# Sequelize Query String Translator

Translates the HTTP Query String from an Express Request object to a Sequelize FindOptions object.

## Installation

```bash
npm i -S sequelizeqsfind
```

## Usage

The example below presumes that you have a database configured with a single table named 'user'

ID | Name | Level
---|------|------
1 | Jon | 9
2 | Nancy | 11

```TypeScript
import {sequelizeqs} from '@jcwatson11/sequelizeqsfind';
const qt = sequelizeqs.TranslateQuery;

let options:FindOptions = qt(req);

// get instance of your model. (ex. User)
User.findAll(options);

// OR, if your querystring adds association includes with the 'with' parameter:

User.findOne(1,options);

```
## Example Queries
```
GET http://localhost:3000/users?whereName=Jon
// Returns record 1
```
```
GET http://localhost:3000/users?whereName=Nancy
// Returns record 2
```
```
GET http://localhost:3000/users?greaterthanLevel=10
// Returns record 2
```

## Production warning
This code is in experimental status. Using this code in production should only happen if you have completed extensive testing after integration with your own software.

## Supported features

- Supports referencing nested relationships from the query string.
- Supports all common simple clause types (listed below)
- Supports sending a JSON object either encoded on the query string, or in the request body that will become the options object that you want. This is used as a starting point (if provided) to add more parameters to as provided from the query string.
- Supports typescript.
- Preliminary tests have been completed.

## Supported Query String Operators

The following query string parameters are supported, and will be translated in the following ways:

`NOTE: The query string examples in the Example column have not been properly URLEncoded. Please always make sure your query strings are properly encoded.`

Prefix | SQL equivalent | Query String Example
-------|-------------|--------
limit | LIMIT ? (Default 10) | ?limit=100
where | WHERE Name = ? | ?whereName=Jon
orwhere | WHERE (Name = ? OR Name = ? | ?orwhereName[]=Jon&orwhereName[]=Nancy
inarray | WHERE Name IN (?,?) | ?inarrayName[]=Jon&inarrayName[]=Nancy
notinarray | WHERE Name NOT IN (?,?) | ?notinarrayName[]=Jon&notinarrayName[]=Nancy
between | WHERE Name BETWEEN ? AND ? | ?betweenLevel[]=4&betweenLevel[]=10
isnull | WHERE Name IS NULL | ?isnullName
isnotnull | WHERE Name IS NOT NULL | ?isnotnullName
like | WHERE Name LIKE ? | ?likeName=%Jon%
ilike | WHERE Name ILIKE ? | ?ilikeName=%jon%
greaterthan | WHERE Level > ? | ?greaterthanLevel=10
greaterthanorequalto | WHERE Level >= ? | ?greaterthanorequaltoLevel=10
lessthan | WHERE Level < ? | ?lessthanLevel=10
lessthanorequalto | WHERE Level <= ? | ?lessthanorequaltoLevel=10
with | (joins a table and selects) | ?with[]=Sponsors
orderby | ORDER BY Name | ?orderbyName=DESC

## Referencing Nested Relations

Nested relations can be referenced with a dot operator between relation names and field names.

Consider a fundraiser schema as follows:

### Table Beneficiaries

BenficiaryId | FirstName | LastName | Phone
-------------|-----------|----------|------
1 | Jon | Watson | 555-1212
2 | Sherlock | Holmes | 555-2121

### Table Sponsors

SponsorId | FirstName | LastName | Phone | AmountCommitted | BeneficiaryId
----------|-----------|----------|-------|-----------------|--------------
1 | Jill | Clemons | 555-1111 | 300 | 1
2 | Fred | Baker | 555-2222 | 200 | 2

```
http://localhost:3000/beneficiaries?greaterthanSponsors.AmountCommitted=250
// Returns Beneficiary 1
```

## Extras

### ORDER BY array syntax

More than one order by can be used in either syntax. But the array syntax is simply a different preference.

#### Example

`?orderby[]=Name|DESC&orderby[]=Phone|ASC`

### Providing an options object

There are two different ways to provide an options JSON object to the request:

1. As a base64 encoded string using the `options` query string parameter. `?options=base64EncodedString`
1. As the request body. Using express [bodyParser.json()](http://expressjs.com/en/resources/middleware/body-parser.html) is helpful for this because it automatically parses JSON input and makes it available via `request.body`.

