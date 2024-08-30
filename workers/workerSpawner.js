const express = require("express");
const { Worker } = require("worker_threads");
require("dotenv").config({ path: "./.env" });
const events = require("events");

const app = express();
const http = require("http");
const { static } = require("express");
const { pool } = require("../db/pool");
const utility = require("../functions");
const server = http.createServer(app);

const io = require("socket.io")(server, {});
const port = 8080;

let pastSpins = [];

io.on("connection", (socket) => {
  console.log("user connected 8080");
  io.emit("hello there", "message");
  io.emit("past Spins", pastSpins);

  try {
    io.emit(
      "time until spin",
      28000 - (Date.now() - pastSpins.slice(-1).pop().dateNow),
    );
  } catch (e) {
    io.emit("error", "Try again later");
  }

  console.log(socket.handshake.auth.token, "socket handshake");

  socket.join("Global chat");
  socket.on("message", (msg) => {
    io.to("Global chat").emit("chat message", msg);
    console.log(msg);
  });
  socket.on("disconnect", () => {
    console.log("user dcd");
  });
});

server.listen(port);

function createWorker(workerData, em) {
  const worker = new Worker(process.env.ROULETTEWORKER, { workerData });
  worker.on("error", (err) => {
    throw err;
  });
  worker.on("message", (msg) => {
    console.log(msg);
    em.emit("Clear Bets");
    io.emit("bet results", msg);
    pastSpins.push({
      colorInner: msg.colorInner,
      colorOuter: msg.colorOuter,
      dateNow: Date.now(),
    });
    if (pastSpins.length > 30) {
      pastSpins.shift();
    }
    // createSpin(
    //   msg.numberInner,
    //   msg.numberOuter,
    //   msg.colorInner,
    //   msg.colorOuter,
    //   msg.wins,
    // );
  });

  worker.on("exit", () => {});
  // return worker
  em.on("NewBet", function (data) {
    console.log("NewBet");
    console.log(data);
    worker.postMessage(data);
  });
}

// const createSpin = async (
//   numberInner,
//   numberOuter,
//   colorInner,
//   colorOuter,
//   wins,
// ) => {
//   const createNewSpin = await pool.query(
//     'INSERT INTO "rouletteSpins" ("time","numberInner","numberOuter","colorInner","colorOuter","wins",) VALUES ($1,$2,$3,$4,$5,$6)',
//     [Date.now(), numberInner, numberOuter, colorInner, colorOuter, wins],
//   );
// };

module.exports = {
  createWorker,
};
