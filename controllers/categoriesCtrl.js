const fs = require("fs/promises");
const { NotFound } = require("http-errors");
const path = require("path");
const categoriesPath = path.join(__dirname, "../", "categories.json");

const categoriesList = async () => {
  try {
    const data = await fs.readFile(categoriesPath);
    const categories = JSON.parse(data);
    return categories;
  } catch (error) {
    throw new NotFound("Not found");
  }
};

const getAll = async (req, res, next) => {
  try {
    const categories = await categoriesList();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll };
