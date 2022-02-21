const { Transaction } = require("../../models/transactions");

const getStats = async (req, res, next) => {
  const {
    year = new Date(Date.now()).getFullYear(),
    month = new Date(Date.now()).getMonth(),
  } = req.query;

  const { _id } = req.user;

  try {
    const transactions = await Transaction.find({
      owner: _id,
      type: false,
      year,
      month,
    });
    const categories = transactions.map((item) => {
      return item.category;
    });
    const uniqueCategories = [...new Set(categories)];

    const categoriesSumm = {};
    uniqueCategories.forEach((category) => {
      transactions.forEach((transaction) => {
        if (transaction.category === category) {
          if (!categoriesSumm[category]) {
            categoriesSumm[category] = 0;
          }
          categoriesSumm[category] += transaction.sum;
        }
      });
    });
    const finalArr = Object.keys(categoriesSumm).map((key) => {
      return {
        category: key,
        total: categoriesSumm[key],
      };
    });

    return res.status(200).json(finalArr);
  } catch (error) {
    next(error);
  }
};

module.exports = getStats;
