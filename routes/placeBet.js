var express = require("express");
var router = express.Router();
const pool = require("../db/pool.js").pool;
const utility = require("../functions");
const authenticateToken = require("../middleware/authenticateToken");

let bets=[5]



router.post("/", authenticateToken, async function (req, res, next) {
    console.log("aa")

    betAmount=req.body.betAmount
    betColor=req.body.betColor
    username=req.body.username

    const findPwInDb = await pool.query(
        'SELECT * FROM "users" WHERE username=($1)', [username]
    );

    if(findPwInDb.rows[0].balance>=betAmount){
        bets.push([betAmount,betColor,username])
    }
    console.log(bets)
    res.send();
});


module.exports = router,bets;
