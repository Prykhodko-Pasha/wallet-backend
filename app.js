const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();
const helmet = require('helmet');
const path = require('path');
const { HttpCode } = require('./service/constants');
// const usersRouter = require("./routes/api/users");
const transactionsRouter = require("./routes/api/transactions");
const categoriesRouter = require("./routes/api/categories");
const usersRouter = require('./routes/api/users');
const { createAccountLimiter } = require('./service/rate-limit');

require('dotenv').config();
const app = express();
const AVATAR_URL = process.env.AVATAR_URL;
app.use(express.static(path.join(__dirname, AVATAR_URL)));

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(helmet());
app.get('env') !== 'test' && app.use(logger(formatsLogger));
app.use(express.json({ limit: 10000 }));


app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
// app.use(express.static("public"));

// app.use("/api/users", usersRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/categories", categoriesRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});


app.use('/api/', createAccountLimiter);
app.use('/api/users', usersRouter);


app.use((_req, res) => {
  res.status(HttpCode.NOT_FOUND).json({ message: 'Not found' });
});

app.use((err, _req, res, _next) => {
  res
    .status(err.status || HttpCode.INTERNAL_SERVER_ERROR)
    .json({ message: err.message });
});

module.exports = app;