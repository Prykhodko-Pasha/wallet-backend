const { Transaction, joiShema } = require("../../models/transactions");
const { BadRequest } = require("http-errors");

const addTransaction = async (req, res, next) => {
  const body = req.body;
  try {
    const { error } = joiShema.validate(body);
    if (error) {
      throw new BadRequest("missing required name field");
    }
    //  const { _id } = req.user;
    //  const newContacts = await Transaction.create({ ...body, owner: _id });
    const newContacts = await Transaction.create({ ...body });
    res.status(201).json(newContacts);
  } catch (error) {
    if (error.message.includes("validation failed")) {
      error.status = 400;
    }
    next(error);
  }
};

module.exports = addTransaction;
