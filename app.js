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

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const userSignupRouter = require("./routes/userSignup");
const userLoginRouter = require("./routes/userLogin");
const spinWheelRouter = require("./routes/spinWheel");
const placeBetRouter = require("./routes/placeBet");
const depositFundsRouter = require("./routes/depositFunds");

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
app.use("/depositFunds", depositFundsRouter);

const userTableCreate = async () => {
  try {
    const makeusertable = await pool.query(` CREATE TABLE IF NOT EXISTS users
    (
        "serialID"  serial not null,
        "uniqueID"  varchar,
        "username"  varchar,
         "firstname" varchar,
        "surname"   varchar,
        "email"     varchar,
        "birthday"  date,
        "hashedPW"  varchar,
        "balance"   decimal);`);
  } catch (error) {
    console.log(error);
  }
};
const rouletteSpinsTableCreate = async () => {
  try {
    const makespinstable =
      await pool.query(` CREATE TABLE IF NOT EXISTS rouletteSpins
    (
    "time"        bigint  not null,
    "numberInner" integer not null,
    "numberOuter" integer not null,
    "colorInner"  varchar not null,
    "colorOuter"  varchar not null,
    "wins"        varchar ARRAY);`);
  } catch (error) {
    console.log(error);
  }
};

rouletteSpinsTableCreate();
userTableCreate();

// const PORT = process.env.PORT || 3000;

// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

module.exports = app;
