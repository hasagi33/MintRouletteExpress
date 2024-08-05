const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const utility = require("./functions");
const jwt = require("jsonwebtoken");
const pool = require("./db/pool").pool;
const cors = require("cors");

const app = express();
const http = require("http");
const { static } = require("express");
const server = http.createServer(app);

const io = require("socket.io")(server, {});
const port = 8080;

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const userSignupRouter = require("./routes/userSignup");
const userLoginRouter = require("./routes/userLogin");
const spinWheelRouter = require("./routes/spinWheel");
const placeBetRouter = require("./routes/placeBet");

require("dotenv").config({ path: "/.env" });

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/userLogin", userLoginRouter);
app.use("/userSignup", userSignupRouter);
app.use("/spinWheel", spinWheelRouter);
app.use("/placeBet", placeBetRouter);

const userTableCreate = async () => {
  try {
    const maketable = await pool.query(` CREATE TABLE IF NOT EXISTS users
    (
        "serialID"  serial not null,
        "uniqueID"  varchar,
        "username"  varchar,
         "firstname" varchar,
        "surname"   varchar,
        "email"     varchar,
        "birthday"  date,
        "hashedPW"  varchar,
        "balance"   integer);`);
  } catch (error) {
    console.log(error);
  }
};
userTableCreate();

io.on("connection", (socket) => {
  console.log("user connected 8080");
  io.emit("hello there", "message");

  console.log(socket.handshake.auth.token, "socket handshake");

  socket.join("Global chat");
  socket.on("message", (msg) => {
    io.to("Global chat").emit("chat message", msg);
    console.log(msg);
  });
  socket.on("disconnect", () => {
    console.log("user dcd");
  });
});

server.listen(port);

module.exports = app;
