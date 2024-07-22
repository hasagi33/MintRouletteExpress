var express = require("express");
var router = express.Router();
const pool = require("../db/pool.js").pool;
const utility = require("../functions");
const events=require('events');
const authenticateToken = require("../middleware/authenticateToken");
const createWorker=require("../workers/workerSpawner")


let bets=[]
let em=new events.EventEmitter();

createWorker(bets,em)

router.post("/", authenticateToken, async function (req, res, next) {
    console.log("placeBet request received")




    betAmount=req.body.betAmount
    betColor=req.body.betColor
    username=req.body.username

    const findPwInDb = await pool.query(
        'SELECT * FROM "users" WHERE username=($1)', [username]
    );

    if(findPwInDb.rows[0].balance>=betAmount){
        bets.push([betAmount,betColor,username])
    }
    em.emit('FirstEvent',bets)

    // bets=[]
    // console.log(bets)
    res.send();
});


module.exports = router;
