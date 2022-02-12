const operations = require('../models/category')

const getAll = async (req, res, next) => {
  try {
    const categories = await operations.categoriesList()
    res.json(categories)
  } catch (error) {
    next(error)
  }
}

module.exports = { getAll }
