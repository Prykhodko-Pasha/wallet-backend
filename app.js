const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

const usersRouter = require("./routes/api/users");
const transactionsRouter = require("./routes/api/transactions");
const categoriesRouter = require("./routes/api/categories");
const statsRouter = require("./routes/api/stats");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
// app.use(express.static("public"));

app.use("/api/users", usersRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/transactions/stats", statsRouter);


app.use((_, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
