const express = require("express");
const authenticateToken = require("../middleware/authenticateToken");
const router = express.Router();
const sendMail = require("../mailer/codeMailer");
const { pool } = require("../db/pool");

router.post("/", authenticateToken, async function (req, res, next) {
  try {
    const findPwInDb = await pool.query(
      'SELECT * FROM "users" WHERE username=($1)',
      [req.body.username],
    );

    let currentBalance = findPwInDb.rows[0].balance;

    let deposit = req.body.deposit + currentBalance;

    if (deposit) {
      const depositUserBalance = await pool.query(
        "UPDATE users SET balance=($1) WHERE username=($2)",
        [deposit, req.body.username],
      );
    }

    res.json({ success: "true", deposit });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
