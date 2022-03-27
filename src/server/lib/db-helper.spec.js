const { expect } = require('chai');
const sinon = require('sinon');

const dbHelper = require('./db-helper');

describe('getDbModel', function () {
  beforeEach('Prepare db', function () {
    this.model = {
      foo: 'bar'
    };

    this.db = {
      models: {
      },
      model: sinon.fake.returns(this.model)
    };

    this.modelName = 'MyModel';
  });

  it('should get the dbModel when schema exists and it has been set previously', function () {
    this.db.models[this.modelName] = this.model;
    const dbModel = dbHelper.getDbModel({ db: this.db, modelName: this.modelName, schema: {} });
    expect(dbModel).to.deep.equal(this.db.models[this.modelName]);
    expect(this.db.model.callCount).to.be.equal(0);
    delete this.db.models[this.modelName];
  });

  it('should get the dbModel when schema exists and it has NOT been set previously', function () {
    const options = { db: this.db, modelName: this.modelName, schema: {} };
    const dbModel = dbHelper.getDbModel(options);
    expect(dbModel).to.deep.equal(this.model);
    expect(this.db.model.callCount).to.be.equal(1);
    expect(this.db.model.calledWith(options.modelName, options.schema)).to.be.equal(true);
  });
});

describe.only('getConnectionScring', function () {
  describe('Form the expected uri when:', function () {
    beforeEach('Set the constants that will not change for the string creation', function () {
      this.fixedConnectionParameters = {
        dbPrefix: 'mongodb',
        dbUserName: 'userTest',
        dbPassword: 'userPassword',
        dbServer: 'good.db.server',
        dbName: 'good-db-name'
      };
    });

    it('No port nor connection options provided', function () {
      const connectionParameters = {
        ...this.fixedConnectionParameters
      };
      const connectionString = dbHelper.getConnectionScring(connectionParameters);
      const { dbPrefix, dbUserName, dbPassword, dbServer, dbName } = connectionParameters;
      const expectedUri = `${dbPrefix}://${dbUserName}:${dbPassword}@${dbServer}/${dbName}`;
      expect(connectionString).to.be.equal(expectedUri);
    });
    
    it('No port but connection options provided', function () {
      const connectionParameters = {
        ...this.fixedConnectionParameters,
        connectionOptions: '?opt1=value1&opt2=value2'
      };
      const connectionString = dbHelper.getConnectionScring(connectionParameters);
      const { dbPrefix, dbUserName, dbPassword, dbServer, dbName, connectionOptions } = connectionParameters;
      const expectedUri = `${dbPrefix}://${dbUserName}:${dbPassword}@${dbServer}/${dbName}${connectionOptions}`;
      expect(connectionString).to.be.equal(expectedUri);
    });

    it('Port provided but no connection options provided', function () {
      const connectionParameters = {
        ...this.fixedConnectionParameters,
        dbPort: '27017'
      };
      const connectionString = dbHelper.getConnectionScring(connectionParameters);
      const { dbPrefix, dbUserName, dbPassword, dbServer, dbPort, dbName } = connectionParameters;
      const expectedUri = `${dbPrefix}://${dbUserName}:${dbPassword}@${dbServer}:${dbPort}/${dbName}`;
      expect(connectionString).to.be.equal(expectedUri);
    });

    it('Port and connection options provided', function () {
      const connectionParameters = {
        ...this.fixedConnectionParameters,
        dbPort: '27017',
        connectionOptions: '?opt1=value1&opt2=value2'
      };
      const connectionString = dbHelper.getConnectionScring(connectionParameters);
      const { dbPrefix, dbUserName, dbPassword, dbServer, dbPort, dbName, connectionOptions } = connectionParameters;
      const expectedUri = `${dbPrefix}://${dbUserName}:${dbPassword}@${dbServer}:${dbPort}/${dbName}${connectionOptions}`;
      expect(connectionString).to.be.equal(expectedUri);
    });
  })
});
