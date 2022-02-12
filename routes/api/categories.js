const express = require("express");
const router = express.Router();
const { getAll } = require("../../controllers/categoriesCtrl");

router.get("/", getAll);

module.exports = router;
