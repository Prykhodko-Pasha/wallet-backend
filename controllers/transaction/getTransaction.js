const { Transaction } = require("../../models/transactions");

const getTransaction = async (req, res, next) => {
  try {
    const { _id } = req.user;
    res.json(await Transaction.find({ owner: _id }));
  } catch (error) {
    next(error);
  }
};

module.exports = getTransaction;
