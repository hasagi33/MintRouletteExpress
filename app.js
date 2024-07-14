const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
// const workerSpawner=require("./workers/workerSpawner");
const utility=require("./functions");
const jwt = require("jsonwebtoken");
const pool = require("./db/pool").pool;

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const userSignupRouter = require("./routes/userSignup");
const userLoginRouter = require("./routes/userLogin");
const spinWheelRouter = require("./routes/spinWheel");
const placeBetRouter = require("./routes/placeBet");
const createWorker = require("./workers/workerSpawner");

require("dotenv").config({ path: "/.env" });


var app = express();

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
        "serialID" serial not null,
        "uniqueID" varchar,
        "username"   varchar,
        "email"      varchar,
        "hashedPW" varchar,
        "balance"    integer);`);
  } catch (error) {
    console.log(error);
  }
};

userTableCreate();
// createWorker();
// setInterval(createWorker,100)

module.exports = app;
