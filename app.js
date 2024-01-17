var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const jwt = require("jsonwebtoken");
const pool = require("./db/pool").pool;

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var userSignupRouter = require("./routes/userSignup");
var userLoginRouter = require("./routes/userLogin");

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

module.exports = app;
