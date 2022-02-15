const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { BadRequest, Conflict, Unauthorized } = require("http-errors");

const { User } = require("../../models");
const { RegisterSchema, joiLoginSchema } = require("../../models/user");
const { authenticate } = require("../../middlewares");

const { SECRET_KEY } = process.env;

const router = express.Router();

// реєстрація користувача з хешуванням пароля
router.post("/register", async (req, res, next) => {
  try {
    const { error } = RegisterSchema.validate(req.body);
    if (error) {
      throw new BadRequest("Bad request (invalid request body)");
    }
    const { email, password, name } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw new Conflict("Provided email already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      email,
      password: hashPass,
      name,
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (error) {
    next(error);
  }
});

// логування користувача на сайті
router.post("/login", async (req, res, next) => {
  try {
    const { error } = joiLoginSchema.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw Unauthorized("Email or password is wrong");
    }
    const passwordUser = await bcrypt.compare(password, user.password);
    if (!passwordUser) {
      throw Unauthorized("Email or password is wrong");
    }

    const { _id, name } = user;
    const payload = {
      id: _id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "30min" });
    await User.findByIdAndUpdate(_id, { token });
    res.json({
      token,
      user: {
        email,
        name,
      },
    });
  } catch (error) {
    next(error);
  }
});

// поточний користувач
router.get("/current", authenticate, async (req, res, next) => {
  const { _id, email, password, name, token } = req.user;
  res.json({
    user: { _id, email, password, name, token },
  });
});

// розлогування
router.get("/logout", authenticate, async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).send();
});

module.exports = router;