

const { Transaction } = require("../../models/transactions")

const getStatistics = async (req, res, next) => {
    const { year, month } = req.query
    const result = await Transaction.find()
    const filteredResultByYear = result.filter(function (el) {
        if (`${year}` === `${el.year}`) return true;
        return false;
    })
    const filteredResultByMonth = filteredResultByYear.filter(function (el) {
        if (`${month}` === `${el.month}`) return true;
        return false;
    })
    const categories = filteredResultByMonth.map(item => {
        return item.category
    })
    const uniqueCategories = [...new Set(categories)];
    const categoriesSumm = {

    }
    uniqueCategories.forEach(function (category) {
        filteredResultByMonth.forEach(function (transaction) {
            if (transaction.category === category) {
                if (!categoriesSumm[category]) {
                    categoriesSumm[category] = 0;
                }
                categoriesSumm[category] += transaction.sum
            }
        })
    })
    return res.json({
        status: "success",
        code: 200,
        data: {
            year,
            month,
            transactions: filteredResultByMonth,
            uniqueCategories,
            categoriesSumm,
        }
    })

};

module.exports = getStatistics;

