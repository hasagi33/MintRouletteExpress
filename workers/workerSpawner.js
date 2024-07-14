const { Worker } = require('worker_threads');
require("dotenv").config({ path: "./.env" });


function createWorker (workerData) {
    const worker = new Worker(process.env.ROULETTEWORKER, { workerData })
    worker.on('error', (err) => { throw err })
    worker.on('message', (msg) => {
        console.log(msg)
        worker.terminate();
    });
    worker.on('exit', () => {

    });

    // return worker

}
// createWorker()

// setInterval(createWorker,1000)

module.exports = createWorker;