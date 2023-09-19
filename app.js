const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();
const socket = require("socket.io");
const { Server } = require("socket.io");


const authRouter = require("./routes/auth");
const reviewRouter = require("./routes/api/review");
const transactionRouter = require("./routes/api/transaction");
const captchaRouter = require("./routes/api/captcha");
const tickerRouter = require("./routes/api/ticker");
const chatRouter = require("./routes/api/chats");

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

app.use("/api/chat", chatRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});


 const io = new Server(3002, {
  cors: {
     origin: "http://localhost:3000", 
     methods: ["GET", "POST"],
    credentials: true
    },
});


const onlineUsers = [];

io.on("connection", (socket) => {
  console.log("User connected");
  // add new user
  socket.on("add-user", (newUserId) => {
    // if (!onlineUsers.some((user) => user.userId === newUserId)) {  // if user is not added before
    //   onlineUsers.push({ userId: newUserId, socketId: socket.id });
    //   console.log("new user is here!", onlineUsers);
    // }
     onlineUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("new user is here!", onlineUsers);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});

module.exports = app;

console.log("node");
