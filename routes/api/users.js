const express = require("express");
const { auth } = require("../../middlewares");
const ctrl = require("../../controllers/users");
const router = express.Router();

router.get("/currentUser", auth, ctrl.getCurrent);

module.exports = router;