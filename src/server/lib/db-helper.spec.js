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
