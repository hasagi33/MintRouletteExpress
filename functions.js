const { sha3_512 } = require("js-sha3");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./.env" });

function makeToken(username) {
  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: "1209600s",
  });
  return token;
}

function makeID(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

function makesalt() {
  let result = "";
  let length = 128;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~`!@#$%^&*()_-+={[}]|:;<,>.?/";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

function hashSaltPassword(pw) {
  let salt = makesalt();
  let hashed = pw + salt + process.env.PEPPER;
  for (let i = 0; i < 100; i++) {
    hashed = sha3_512(hashed);
  }
  return hashed + salt;
}

function unHashSaltPassword(pw, salt) {
  let hashed = pw + salt + process.env.PEPPER;
  for (let i = 0; i < 100; i++) {
    hashed = sha3_512(hashed);
  }
  return hashed + salt;
}

module.exports = { makeID, hashSaltPassword, unHashSaltPassword, makeToken };
