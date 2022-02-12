const { Transaction, joiShema } = require("../../models/transactions");
const { BadRequest } = require("http-errors");

const addTransaction = async (req, res, next) => {
  try {
    const { error } = joiShema.validate(req.body);
    if (error) {
      throw new BadRequest("missing required name field");
    }

    const newContacts = await Transaction.create({ ...req.body });
    //  const { _id } = req.user;
    //  const newContacts = await Transaction.create({ ...body, owner: _id });
    res.status(201).json(newContacts);
  } catch (error) {
    if (error.message.includes("validation failed")) {
      error.status = 400;
    }
    next(error);
  }
};

module.exports = addTransaction;
