const jwt = require("jsonwebtoken");
const utility = require("../functions");
const { errorHandler } = require("../functions");

require("dotenv").config({ path: "./.env" });

const authenticateToken = (req, res, next) => {
  try {
    let token=req.headers.token;
    // let token = req.headers.token.split(".")[1];
    let decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded)
    //CHANGE TO SECURE ID
    req.body.username=decoded.username
    next();
  } catch {
    console.log("unauthorized");
    res.statusCode = 403;
    res.send()
    // res.json(errorHandler(res.statusCode));
    // next();
  }
};

module.exports = authenticateToken;
