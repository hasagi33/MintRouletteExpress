const express = require("express");
const router = express.Router();
const pool = require("../db/pool.js").pool;
const utility = require("../functions");
const authenticateToken = require("../middleware/authenticateToken");

router.post("/", async function (req, res, next) {
  try {
    console.log("LOGIN REQUEST");
    let username = req.body.username;
    let userPW = req.body.password;
    const findPwInDb = await pool.query(
      'SELECT * FROM "users" WHERE username=($1)',
      [username],
    );
    let salt = findPwInDb.rows[0].hashedPW.substring(128);
    let userHashedPW = utility.unHashSaltPassword(userPW, salt);

    if (
      findPwInDb.rowCount == 1 &&
      findPwInDb.rows[0].hashedPW == userHashedPW
    ) {
      let jwToken = utility.makeToken(username, findPwInDb.rows[0].uniqueID);
      console.log("SUCCESSFUL LOGIN", username);
      res.statusCode = 200;
      res.json({ token: jwToken });
    } else {
      res.statusCode = 400;
      res.json({ message: "bad login" });
    }
  } catch (e) {
    console.log(e);
  }
  res.end();
});

module.exports = router;
