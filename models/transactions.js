const { Schema, model } = require("mongoose");
const Joi = require("joi");

const transactionSchema = Schema(
  {
    type: {
      type: Boolean,
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
    category: {
      type: String,
      enum: [
        "basic",
        "products",
        "restaurant",
        "auto",
        "house",
        "development",
        "rest",
        "children",
        "animals",
        "other",
      ],
      default: "basic",
    },
  },
  { versionKey: false, timestamps: true }
);

const joiShema = Joi.object({
  type: Joi.boolean().required(),
  category: Joi.string().valueOf(
    "basic",
    "products",
    "restaurant",
    "auto",
    "house",
    "development",
    "rest",
    "children",
    "animals",
    "other"
  ),
  sum: Joi.number().required(),
  comment: Joi.string(),
  total: Joi.number(),
  month: Joi.number(),
  year: Joi.number(),
});

const Transaction = model("transaction", transactionSchema);

module.exports = { Transaction, joiShema };
