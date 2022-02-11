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
  balance: {
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
  balance: Joi.number().required(),
});

const Transaction = model("contact", transactionSchema);

module.exports = { Transaction, joiShema };
