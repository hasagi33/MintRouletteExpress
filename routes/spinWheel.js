const express = require("express");
const router = express.Router();
const pool = require("../db/pool.js").pool;
const utility = require("../functions");
const authenticateToken = require("../middleware/authenticateToken");
const createWorker = require("../workers/workerSpawner");

router.get("/", async function (req, res, next) {
  let random = 123;
  res.json({ success: "true", random: random });
});

module.exports = router;
