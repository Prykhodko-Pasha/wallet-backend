const express = require("express");
const router = express.Router();
const transactionController = require("../../controllers/transaction");
const auth = require("../../middlewares/auth");

router.post("/", auth, transactionController.addTransactions);
router.get("/", auth, transactionController.getTransactions);

module.exports = router;
