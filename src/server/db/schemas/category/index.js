const mongoose = require('mongoose');
const MpathPlugin = require('mongoose-mpath');

const constants = require('../../../constants');

/*
 * Parent and path are not part of this schema definition
 * given the fact that mongoose-mpath does this for us at
 * this moment of category creation
 */
const category = {
  name: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: constants.CATEGOTY_TYPES
  },
  creation: {
    type: Date,
    required: true
  },
  description: { type: String, required: false },
  expenses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: constants.MODEL_NAMES.EXPENSE
  }]
};

const { Schema } = mongoose;
const categorySchema = new Schema(category);
categorySchema.plugin(MpathPlugin, {
  pathSeparator: ',',
  onDelete: 'REPARENT',
  idType: Schema.ObjectId
});
module.exports = { mongoose, categorySchema };
