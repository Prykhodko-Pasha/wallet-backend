const { Schema, model } = require("mongoose");
const Joi = require("joi");

const transactionSchema = Schema({
  type: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  sum: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
  },
  comment: {
    type: String,
  },
  total: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

const joiShema = Joi.object({
  type: Joi.string().required(),
  category: Joi.string().required(),
  sum: Joi.number().required(),
  comment: Joi.string().required(),
  date: Joi.string().required(),
  total: Joi.number().required(),
  month: Joi.number().required(),
  year: Joi.number().required(),
});

const Transaction = model("transaction", transactionSchema);

module.exports = { Transaction, joiShema };
