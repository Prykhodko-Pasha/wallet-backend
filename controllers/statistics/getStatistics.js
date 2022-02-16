
const { Transaction } = require("../../models/transactions")

const getStatistics = async (req, res, next) => {
    console.log("test")
}

module.exports = getStatistics;

module.exports = async ({ user: { userId }, query }, res) => {
    const amountMoney = array => array.reduce((acc, { sum }) => acc + sum, 0);
    const amountCategories = array =>
        array.reduce((acc, value) => {
            const category = value.category.name;
            const { sum } = value;

            acc[category]
                ? (acc[category] = acc[category] += sum)
                : (acc[category] = sum);

            return acc;
        }, {});
    //
    const getUniqueMonth = array =>
        array.reduce((acc, { month }) => {
            if (!acc.includes(month)) {
                acc.push(month);
            }
            return acc;
        }, []);
    const getUniqueYear = array =>
        array.reduce((acc, { year }) => {
            if (!acc.includes(year)) {
                acc.push(year);
            }
            return acc;
        }, []);

    let totalIncomeArr;
    let totalSpendArr;

    if (query.month && query.year) {
        totalIncomeArr = await Transaction.find({ owner: userId, type: true, month, year }).populate('category');
        totalSpendArr = await Transaction.find({ owner: userId, type: true, month, year }).populate('category');
    } else {
        totalIncomeArr = await Transaction.find({ owner: userId, type: true }).populate('category');
        totalSpendArr = await Transaction.find({ owner: userId, type: false }).populate('category');
    }

    const totalIncome = amountMoney(totalIncomeArr);
    const totalSpend = amountMoney(totalSpendArr);
    const categoriesSummary = amountCategories(totalSpendArr);
    const uniqueMonth = getUniqueMonth(totalSpendArr);
    const uniqueYear = getUniqueYear(totalSpendArr);

    return res.json({
        status: "success",
        code: 200,
        data: {
            categoriesSummary,
            totalIncome,
            totalSpend,
            uniqueMonth: uniqueMonth.sort(),
            uniqueYear: uniqueYear.sort(),
        },
    });
};





// module.exports = async ({ user: { id }, query }, res) => {
//     const amountMoney = array => array.reduce((acc, { money }) => acc + money, 0);
//     const amountCategories = array =>
//         array.reduce((acc, value) => {
//             const category = value.category.name;
//             const { money } = value;

//             acc[category]
//                 ? (acc[category] = acc[category] += money)
//                 : (acc[category] = money);

//             return acc;
//         }, {});
//     //
//     const getUniqueMonth = array =>
//         array.reduce((acc, { month }) => {
//             if (!acc.includes(month)) {
//                 acc.push(month);
//             }
//             return acc;
//         }, []);
//     const getUniqueYear = array =>
//         array.reduce((acc, { year }) => {
//             if (!acc.includes(year)) {
//                 acc.push(year);
//             }
//             return acc;
//         }, []);

//     let totalIncomeArr;
//     let totalSpendArr;

//     if (query.month && query.year) {
//         totalIncomeArr = await service.getAllIncomeByDate(
//             id,
//             query.month,
//             query.year,
//         );
//         totalSpendArr = await service.getAllSpendByDate(
//             id,
//             query.month,
//             query.year,
//         );
//     } else {
//         totalIncomeArr = await service.getAllIncome(id);
//         totalSpendArr = await service.getAllSpend(id);
//     }

//     const totalIncome = amountMoney(totalIncomeArr);
//     const totalSpend = amountMoney(totalSpendArr);
//     const categoriesSummary = amountCategories(totalSpendArr);
//     const uniqueMonth = getUniqueMonth(totalSpendArr);
//     const uniqueYear = getUniqueYear(totalSpendArr);

//     return res.json({
//         status: 'Success',
//         code: 200,
//         data: {
//             categoriesSummary,
//             totalIncome,
//             totalSpend,
//             uniqueMonth: uniqueMonth.sort(),
//             uniqueYear: uniqueYear.sort(),
//         },
//     });
// };


// getAllIncome: userId =>
//     Transaction.find({ owner: userId, type: 'income' }).populate('category'),

//     getAllIncomeByDate: (userId, month, year) =>
//         Transaction.find({ owner: userId, type: 'income', month, year }).populate(
//             'category',
//         );

// getAllSpend: userId =>
//     Transaction.find({ owner: userId, type: 'spend' }).populate('category');

// getAllSpendByDate: (userId, month, year) =>
//     Transaction.find({ owner: userId, type: 'spend', month, year }).populate(
//         'category',
//     );