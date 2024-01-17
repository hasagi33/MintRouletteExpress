var express = require("express");
var router = express.Router();
const pool = require("../db/pool.js").pool;
const utility = require("../functions");

//let userNameRegex = /^[a-zA-z0-9_.-]{1}[a-zA-z0-9_.-]{1,25}$/
// let emailRegex = /^[a-zA-Z0-9._]+@[a-zA-Z]+\.?[a-zA-z]+?\.[a-zA-Z]{1,}$/;
// let passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\];:'",.<>?\\d]).{6,30}$/;
// let birthdateRegex = /^[1-2][9,8,0][0-9][0-9]-[0-1][0-9]-[0-9]{2}$/;
// let specialRegex = /^[0-9]{8}$/;    za pw

router.post("/", async function (req, res) {
  let username = req.body.name;
  let email = req.body.mail;
  let userPW = req.body.password1;
  let birthdate = req.body.date1;
  var today = new Date();

  today = today.toISOString().substring(0, 10).replaceAll("-", "");
  if (today - birthdate > 180000) {
    if (
      /^[a-zA-z0-9_.-]{1}[a-zA-z0-9_.-]{1,25}$/.test(username) &&
      /^[a-zA-Z0-9._]+@[a-zA-Z]+\.?[a-zA-z]+?\.[a-zA-Z]{1,}$/.test(email) &&
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\];:'",.<>?\\d]).{6,30}$/.test(
        userPW
      ) &&
      /[!@#$%^&*()_+{}\[\];:'",.<>?\\]/.test(userPW) &&
      /^[0-9]{8}$/.test(birthdate)
    ) {
      const userExists = await pool.query(
        'SELECT * FROM "users" WHERE username=($1)',
        [username]
      );
      const emailExists = await pool.query(
        'SELECT * FROM "users" WHERE email=($1)',
        [email]
      );

      if (userExists.rowCount == 0 && emailExists.rowCount == 0) {
        let newUserId = utility.makeID(10);
        const createUser = await pool.query(
          'INSERT INTO "users" ("serialID","uniqueID","username","email","hashedPW","balance") VALUES (DEFAULT,$1,$2,$3,$4,0)',
          [newUserId, username, email, utility.hashSaltPassword(userPW)]
        );
        res.statusCode = 200;
        res.json({ success: "true" }); //pitat asada
      } else {
        res.statusCode = 400;
        res.json({ success: "false", error: "User exists" });
      }
    } else {
      res.statusCode = 422;
      res.json({ success: "false", error: "Input is wrong" });
    }
  }
  res.end();
});

module.exports = router;
