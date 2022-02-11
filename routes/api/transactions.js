const express = require("express");
const router = express.Router();
const transactionController = require("../../controllers/transaction");
const { auth } = require("../../middlewares/auth");
router.post("/", auth, transactionController.getTransactions);
