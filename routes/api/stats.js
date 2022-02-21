const express = require("express");
const router = express.Router();
const { getStats } = require("../../controllers/stats");
const auth = require("../../middlewares/auth");

router.get("/", auth, getStats);

module.exports = router;
