const { Schema, model } = require("mongoose");
const Joi = require("joi");

const transactionSchema = Schema({
  active: {
    type: Boolean,
    default: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    default: true,
  },
  category: {
    type: String,
    enum: ["Other", "Income", "consumption"],
    default: "Other",
  },
  sum: {
    type: Number,
    required: true,
  },

  comment: {
    type: String,
  },
  total: {
    type: Number,
  },
  month: {
    type: Number,
  },
  year: {
    type: Number,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

const joiShema = Joi.object({
  active: Joi.bool,
  type: Joi.string().required(),
  category: Joi.string().valueOf("Other", "Income", "consumption"),
  sum: Joi.number().required(),
  comment: Joi.string(),
  date: Joi.string(),
  total: Joi.number(),
  month: Joi.number(),
  year: Joi.number(),
});

const Transaction = model("transaction", transactionSchema);

module.exports = { Transaction, joiShema };
