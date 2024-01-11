var express = require("express");
var router = express.Router();

router.post("/", async function (req, res) {
    console.log(req);
    let username = req.name;
    let email=req.mail
    let password1=req.password1
    let password2=req.password2
    let birthdate=req.date1
    let timeNow=date.now()
    if((password1===password2)&&(birthdate-timeNow)){
        const userExists= await pool.query('SELECT * FROM "users" WHERE username=($1)', [username])
        if(userExists.rowCount>1)
    }
    res.end();
});

module.exports = router;
