const { Worker } = require('worker_threads');
require("dotenv").config({ path: "./.env" });
const events = require('events');


function createWorker (workerData,em) {
    const worker = new Worker(process.env.ROULETTEWORKER, { workerData })
    worker.on('error', (err) => { throw err })
    worker.on('message', (msg) => {
        console.log(msg)
    });

    worker.on('exit', () => {

    });
    // return worker
    em.on('NewBet',function (data) {
        console.log("NewBet")
        console.log(data)
        worker.postMessage( data );
    })
}


// createWorker()

// setInterval(createWorker,1000)

module.exports = createWorker;