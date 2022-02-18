const { Transaction, joiShema } = require("../../models/transactions");
const { BadRequest, Conflict } = require("http-errors");

const addTransaction = async (req, res, next) => {
  const body = req.body;
  try {
    const { error } = joiShema.validate(body);
    if (error) {
      throw new BadRequest("missing required name field");
    }
    const { _id } = req.user;
    const { sum, type } = req.body;
    let total = 0;
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const lastTransaction = await Transaction.findOne(
      {
        owner: _id,
      },
      {},
      { sort: { createdAt: -1 } }
    );
    if (lastTransaction) {
      type
        ? (total = lastTransaction.total + sum)
        : (total = lastTransaction.total - sum);
    } else {
      type
        ? (total = sum)
        : new Conflict("there are not enough funds on your balance");
    }
    if (total < 0) {
      throw new Conflict("there are not enough funds on your balance");
    }
    const newTransactions = await Transaction.create({
      ...req.body,
      total,
      month,
      year,
      owner: _id,
    });
    res.status(201).json(newTransactions);
  } catch (error) {
    if (error.message.includes("validation failed")) {
      error.status = 400;
    }
    next(error);
  }
};

module.exports = addTransaction;
