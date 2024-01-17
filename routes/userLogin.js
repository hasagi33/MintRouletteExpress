var express = require("express");
var router = express.Router();
const pool = require("../db/pool.js").pool;
const utility = require("../functions");

router.post("/", async function (req, res) {
  let username = req.body.name;
  let userPW = req.body.password1;
  const findPwInDb = await pool.query(
    'SELECT * FROM "users" WHERE username=($1)',
    [username]
  );
  let salt = findPwInDb.rows[0].hashedPW.substring(128);
  let userHashedPW = utility.unHashSaltPassword(userPW, salt);

  console.log(userPW);

  if (findPwInDb.rowCount == 1 && findPwInDb.rows[0].hashedPW == userHashedPW) {
    let jwToken = utility.makeToken(username);
    res.statusCode = 200;
    res.json({ success: "true", token: jwToken });
    console.log(findPwInDb.rows[0].hashedPW);
    console.log(userHashedPW);
  } else {
    res.statusCode = 400;
    res.json({ success: "false" });
  }
  res.end();
});

module.exports = router;
