var express = require("express");
var router = express.Router();
const pool = require("../db/pool.js").pool;
const utility = require("../functions");

router.post("/", async function (req, res) {
  try {
    let username = req.body.username;
    let firstname = req.body.firstname;
    let surname = req.body.surname;
    let email = req.body.email;
    let userPW = req.body.password;
    let birthday = new Date(req.body.birthday);
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year} ${month} ${day}`;
    let today = new Date(formattedDate);

    birthday = birthday.toISOString().substring(0, 10).replaceAll("-", "");
    today = today.toISOString().substring(0, 10).replaceAll("-", "");

    if (today - birthday > 180000) {
      if (
        /.*[A-Za-z].*/.test(username) &&
        username.length <= 16 &&
        username.length >= 6 &&
        /^[A-Za-z]+$/.test(firstname) &&
        firstname.length <= 40 &&
        firstname !== "" &&
        /^[A-Za-z]+$/.test(surname) &&
        surname.length <= 40 &&
        surname !== "" &&
        /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,6}$/.test(email) &&
        /[!@#$%^&*(),.?":{}|<>]/.test(userPW) &&
        userPW.length >= 8 &&
        userPW.length <= 40
      ) {
        const userExists = await pool.query(
          'SELECT * FROM "users" WHERE username=($1)',
          [username],
        );
        const emailExists = await pool.query(
          'SELECT * FROM "users" WHERE email=($1)',
          [email],
        );
        if (userExists.rowCount === 0 && emailExists.rowCount === 0) {
          let newUserId = utility.makeID(10);
          const createUser = await pool.query(
            'INSERT INTO "users" ("serialID","uniqueID","username","firstname","surname","email","birthday","hashedPW","balance") VALUES (DEFAULT,$1,$2,$3,$4,$5,$6,$7,0)',
            [
              newUserId,
              username,
              firstname,
              surname,
              email,
              birthday,
              utility.hashSaltPassword(userPW),
            ],
          );
          res.statusCode = 201;
          res.json({ message: "User Created Successfully" });
        } else {
          res.statusCode = 400;
          if (emailExists.rowCount !== 0) {
            res.json({ message: "Email already exists" });
          }
          if (userExists.rowCount !== 0) {
            res.json({ message: "Username already exists" });
          }
        }
      } else {
        console.log(req.body);
        res.statusCode = 422;
        res.json({ message: "Wrong Sign up input" });
      }
    } else {
      res.statusCode = 422;
      res.json({ message: "Underage" });
    }
    res.end();
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
