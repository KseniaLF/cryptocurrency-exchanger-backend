const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

const mongoose = require("mongoose");
const { DB_HOST } = process.env;
mongoose.set("strictQuery", true);

const authRouter = require("./routes/auth");
const reviewRouter = require("./routes/api/review");
const transactionRouter = require("./routes/api/transaction");
const captchaRouter = require("./routes/api/captcha");
const tickerRouter = require("./routes/api/ticker");
const chatRouter = require("./routes/api/chats");
const newsRouter = require("./routes/api/news");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();

const server = app.listen(3001);

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

// const io = require("socket.io")(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

const io = require("socket.io")(server, {
  cors: {
    origin: "https://kyiv-cryptocurrency-exchanger.vercel.app/",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

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

app.use("/api/news", newsRouter);

app.use("/api/chat", chatRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});



let onlineUsers = [];

io.on("connection", (socket) => {
  // add new user
  socket.on("add-user", (newUserId, userRole) => {
    if (!onlineUsers.some((user) => user.userId === newUserId)) {
      // if user is not added before
      onlineUsers.push({
        userId: newUserId,
        role: userRole,
        socketId: socket.id,
      });
      console.log("new user is here!", onlineUsers);
    }
    // send all active users to new user
    io.emit("get-users", onlineUsers);
  });
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    console.log("user disconnected", onlineUsers);
    // send all online users to all users
    io.emit("get-users", onlineUsers);
  });

  socket.on("send-msg", (data) => {
    if (onlineUsers) {
      const sendUserSocket = onlineUsers.find(
        (user) => user.userId === data.to
      );
      console.log("Message to", sendUserSocket);
      if (sendUserSocket) {
        socket.to(sendUserSocket.socketId).emit("msg-recieve", data);
        console.log(data);
        console.log(sendUserSocket.socketId);
      }
    }
  });
});

module.exports = app;

console.log("node");
