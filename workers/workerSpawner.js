const express = require("express");
const { Worker } = require("worker_threads");
require("dotenv").config({ path: "./.env" });
const events = require("events");

const app = express();
const http = require("http");
const { static } = require("express");
const server = http.createServer(app);

const io = require("socket.io")(server, {});
const port = 443;

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("message", (msg) => {
    console.log("a message detected");
    io.emit("chat message", "acknowledged");
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
  });

  worker.on("exit", () => {});
  // return worker
  em.on("NewBet", function (data) {
    console.log("NewBet");
    console.log(data);
    worker.postMessage(data);
  });
}

// createWorker()

// setInterval(createWorker,1000)

module.exports = createWorker;
