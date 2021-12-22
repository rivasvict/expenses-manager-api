const { expect } = require('chai');
const sinon = require('sinon');

const Category = require('./category');

describe('Category model', function () {
  beforeEach('Create category objects', function () {
    this.getCategoryInstance = categoryToInstance => new Category(categoryToInstance);
    this.creationDate = new Date();
    this.validCategory = {
      name: 'test',
      description: 'This is a test description',
      creation: this.creationDate,
      type: 'income'
    };
  });

  describe('Instance category with validation', function () {
    describe('Data type errors', function () {
      it('Should throw an error when invalid name data type', function () {
        try {
          const categoryInvalidNameType = {
            name: [],
            description: 'This is a test description',
            creation: this.creationDate,
            type: 'income'
          };

          this.getCategoryInstance(categoryInvalidNameType);
        } catch (error) {
          expect(error.message).to.be.equal('Validation failed: name: Cast to string failed for value "[]" (type Array) at path "name"');
        }
      });

      describe('Type data validation errors', function () {
        it('Should throw an error when invalid type data type', function () {
          try {
            const cathegoryInvalidTypeDataType = {
              name: 'A name',
              description: 'This is a test description',
              creation: this.creationDate,
              type: []
            };

            this.getCategoryInstance(cathegoryInvalidTypeDataType);
          } catch (error) {
            expect(error.message).to.be.equal('Validation failed: type: Cast to string failed for value "[]" (type Array) at path "type"');
          }
        });

        it('Should throw an error when invalid type value used', function () {
          try {
            const categoryInvalidTypeValue = {
              name: 'A name',
              description: 'This is a test description',
              creation: this.creationDate,
              type: 'myType'
            };

            this.getCategoryInstance(categoryInvalidTypeValue);
          } catch (error) {
            expect(error.message).to.be
              .equal('Validation failed: type: `myType` is not a valid enum value for path `type`.');
          }
        });
      });

      it('Should throw an error when invalid creation data type', function () {
        try {
          const categoryInvalidCreationDataType = {
            name: 'A name',
            description: 'This is a test description',
            creation: 'Just string',
            type: 'expense'
          };

          this.getCategoryInstance(categoryInvalidCreationDataType);
        } catch (error) {
          expect(error.message).to.be
            .equal('Validation failed: creation: Cast to date failed for value "Just string" (type string) at path "creation"');
        }
      });
    });

    it('Should throw an error when missing attributes', function () {
      try {
        const categoryWithMissingRequiredAttributes = {
          name: 'test'
        };

        this.getCategoryInstance(categoryWithMissingRequiredAttributes);
      } catch (error) {
        expect(error.message)
          .to.be.equal('Validation failed: creation: Path `creation` is required., type: Path `type` is required.');
      }
    });

    it('Should create a new category object when valid data is passed', function () {
      const category = this.getCategoryInstance(this.validCategory);
      expect(category.name).to.be.equal(this.validCategory.name);
      expect(category.type).to.be.equal(this.validCategory.type);
      expect(category.description).to.be.equal(this.validCategory.description);
      expect(category.creation).to.be.equal(this.validCategory.creation);
      expect(category.id).not.to.equal(undefined);
    });
  });

  describe('category.create', function () {
    beforeEach('Prepare save stub', function () {
      this.category = this.getCategoryInstance(this.validCategory);
      this.categoryToResolve = Object
        .assign(Object.create(this.validCategory), { id: this.category.id });
      this.saveStub = sinon.stub(this.category, 'save').returns(Promise.resolve(this.categoryToResolve));
    });

    afterEach('Restore saveStub', function () {
      this.saveStub.restore();
    });

    it('Should create a new category when data for the category is valid', async function () {
      const savedCategory = await this.category.create();
      expect(savedCategory.name).to.be.equal(this.validCategory.name);
      expect(savedCategory.type).to.be.equal(this.validCategory.type);
      expect(savedCategory.description).to.be.equal(this.validCategory.description);
      expect(savedCategory.creation).to.be.equal(this.validCategory.creation);
      expect(savedCategory.id).not.to.equal(undefined);
    });
  });
});
