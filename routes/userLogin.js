var express = require("express");
var router = express.Router();
const pool = require("../db/pool.js").pool;
const utility = require("../functions");

router.post("/", async function (req, res) {
  let username = req.loremipsum;
  let hashedPW = req.pw1;
  const findUser = res.end();
});

module.exports = router;
