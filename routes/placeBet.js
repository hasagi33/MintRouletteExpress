const express = require("express");
const router = express.Router();
const pool = require("../db/pool.js").pool;
const utility = require("../functions");
const events = require("events");
const authenticateToken = require("../middleware/authenticateToken");
const workerSpawner = require("../workers/workerSpawner");
let bettingUsers = {};

let em = new events.EventEmitter();

em.on("Clear Bets", function () {
  bettingUsers = {};
});

workerSpawner.createWorker({}, em);

router.post("/", authenticateToken, async function (req, res, next) {
  try {
    console.log("placeBet request received");
    let bets = [];

    betAmount = req.body.betAmount;
    betColor = req.body.betColor;
    username = req.body.username;

    const findPwInDb = await pool.query(
      'SELECT * FROM "users" WHERE username=($1)',
      [username],
    );
    let alreadyBet = 0;
    if (bettingUsers.hasOwnProperty(username)) {
      alreadyBet = bettingUsers.username;
    }
    if (findPwInDb.rows[0].balance - alreadyBet >= betAmount || true) {
      // DISABLE TRUE----
      bets.push([betAmount, betColor, username]);
      em.emit("NewBet", Object.assign({}, bets));
      if (bettingUsers.hasOwnProperty(username)) {
        bettingUsers[username] += Number(betAmount);
      } else {
        bettingUsers[username] = Number(betAmount);
      }
    }
    console.log(bettingUsers);

    // console.log(bets);

    res.send();
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
