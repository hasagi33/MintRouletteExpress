const { workerData, parentPort } = require('worker_threads')
const math=require('math')
let randomInner,randomOuter,colorOuter,colorInner

parentPort.on('message', (bets) => {
    console.log('Received message from main thread:' ,bets);

    rollNumbers()

    for(let i=0;i<bets.length;i++){

    }

    console.log(colorInner,colorOuter)

    parentPort.postMessage({
        numberInner:randomInner,
        numberOuter:randomOuter,
        // isPrime: isPrime
    })
});


function rollNumbers(){
    randomInner = math.floor(math.random() * 40) + 1
    randomOuter = math.floor(math.random() * 40) + 1
    colorInner = "";
    colorOuter = "";

    if (randomInner % 2 === 0) {
        colorInner = "purple"
    } else if ((randomInner + 1) % 4 === 0) {
        colorInner = "white"
    } else if (((randomInner - 1) % 4 === 0) && ((randomInner + 3) % 8 !== 0) && randomInner !== 1) {
        colorInner = "red"
    } else if ((randomInner - 1) % 4 === 0 && randomInner !== 1) {
        colorInner = "pink"
    } else if (randomInner === 1) {
        colorInner = "green"
    }

    if (randomOuter % 2 === 0) {
        colorOuter = "purple"
    } else if ((randomOuter + 1) % 4 === 0) {
        colorOuter = "white"
    } else if (((randomOuter - 1) % 4 === 0) && ((randomOuter + 3) % 8 !== 0) && randomOuter !== 1) {
        colorOuter = "red"
    } else if ((randomOuter - 1) % 4 === 0 && randomOuter !== 1) {
        colorOuter = "pink"
    } else if (randomOuter === 1) {
        colorOuter = "green"
    }
}


