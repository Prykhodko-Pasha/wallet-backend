/* eslint-disable no-unused-vars */

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { BadRequest, Conflict, Unauthorized } = require("http-errors");

const { User } = require("../../models");
const { joiSignupSchema, joiLoginSchema } = require("../../models/user");
 const { authenticate, upload } = require("../../middlewares");
const { SECRET_KEY } = process.env;

 const router = express.Router();


 router.post("/singup", async (res, req, next) => {});


 router.post("/login", async (req, res, next) => {});

 router.get("/logout", authenticate, async (req, res) => {
const { _id } = req.user;
await User.findByIdAndUpdate(_id, { token: null });
res.status(204).send();
});

module.exports = router;