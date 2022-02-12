const { Transaction } = require("../../models/transactions");

const getTransaction = async (req, res, next) => {
  try {
    res.json(await Transaction.find());
  } catch (error) {
    next(error);
  }
};

module.exports = getTransaction;
