var express = require("express");
var router = express.Router();
const pool = require("../db/pool.js").pool;
const utility = require("../functions");
const authenticateToken = require("../middleware/authenticateToken");

router.post("/", authenticateToken, async function (req, res, next) {});

module.exports = router;
