const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

const authRouter = require("./routes/auth");
const reviewRouter = require("./routes/api/review");
const transactionRouter = require("./routes/api/transaction");
const captchaRouter = require("./routes/api/captcha");
const tickerRouter = require("./routes/api/ticker");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/users", authRouter);

app.use("/api/review", reviewRouter);

app.use("/api/transactions", transactionRouter);

app.use("/captcha", captchaRouter);

app.use("/api/ticker", tickerRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;

console.log("node");
