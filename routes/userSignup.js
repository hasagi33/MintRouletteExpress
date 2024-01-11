var express = require("express");
var router = express.Router();
const pool = require("../db/pool.js").pool;
const utility = require("../functions");

router.post("/", async function (req, res) {
  console.log(req);
  let username = req.name;
  let email = req.mail;
  let pw1 = req.password1;
  let pw2 = req.password2;
  let birthdate = req.date1;
  let timeNow = date.now();
  if (pw1 === pw2 && birthdate - timeNow > 568025136000) {
    const userExists = await pool.query(
      'SELECT * FROM "users" WHERE username=($1)',
      [username]
    );
    if (userExists.rowCount == 0) {
      let newUserId = utility.makeid(10);
      const createUser = await pool.query(
        'INSERT INTO "users" ("serialID","uniqueID","username","email","password","balance") VALUES (DEFAULT,$1,$2,$3,$4,0)',
        [newUserId, username, email, utility.hashSaltPassword(pw1)]
      );
      res.json({ success: "true" }); //pitat asada
    } else {
      res.json({ success: "false" });
    }
  } else {
    res.json({ success: "false" });
  }
  res.end();
});

module.exports = router;
