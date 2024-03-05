var express = require("express");
var router = express.Router();
const pool = require("../db/pool.js").pool;
const utility = require("../functions");
const authenticateToken = require("../middleware/authenticateToken");

router.get("/", async function (req, res, next) {
  //axios stuff to tell frontend when and what to spin idk
});

module.exports = router;
