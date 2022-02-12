const { Transaction, joiShema } = require("../../models/transactions");
const { BadRequest, Conflict, Unauthorized } = require("http-errors");

const addTransaction = async (req, res, next) => {
  const body = req.body;
  try {
    const { error } = joiShema.validate(body);
    if (error) {
      throw new BadRequest("missing required name field");
    }
    // const { _id } = req.user;
    // const { sum, type } = req.body;
    // let total = 0; // удалити 0, якщо при регістрації буде вказаний баланс
    // !type ? (total += sum) : (total -= sum);
    // const newTransactions = await Transaction.create({
    //   ...req.body,
    //   total,
    //   sum,
    //   owner: _id,
    // });
    // =========================================== //
    // const { _id } = req.user;
    const { sum, type } = req.body;
    let total = 0;
    const lastTransaction = await Transaction.findOne(
      {
        // owner: _id
      },
      {},
      { sort: { created_at: -1 } }
    );
    if (lastTransaction) {
      type
        ? (total = lastTransaction.total - sum)
        : (total = lastTransaction.total + sum);
    } else {
      type ? (total = sum) : new Conflict();
    }
    if (total < 0) {
      throw new Unauthorized();
    }
    const newTransactions = await Transaction.create({
      ...req.body,
      sum,
      total,
      // owner: _id,
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
