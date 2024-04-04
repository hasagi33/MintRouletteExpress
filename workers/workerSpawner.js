const { Worker } = require('worker_threads');

function createWorker (workerData) {
    const worker = new Worker('./rouletteWorker.js', { workerData })
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

setInterval(createWorker,1000)