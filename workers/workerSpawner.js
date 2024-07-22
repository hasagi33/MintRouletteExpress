const { Worker } = require('worker_threads');
require("dotenv").config({ path: "./.env" });
const events = require('events');


function createWorker (workerData,em) {
    const worker = new Worker(process.env.ROULETTEWORKER, { workerData })
    worker.on('error', (err) => { throw err })
    worker.on('message', (msg) => {
        console.log(msg)

        // worker.terminate();
    });
    worker.on('exit', () => {

    });
    // return worker
    em.on('FirstEvent',function (data) {
        worker.postMessage(data);
    })
}


// createWorker()

// setInterval(createWorker,1000)

module.exports = createWorker;