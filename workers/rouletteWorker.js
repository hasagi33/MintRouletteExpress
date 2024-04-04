const { workerData, parentPort } = require('worker_threads')
const math=require('math')

// random number prime checker
let random=math.ceil(math.random()*1000)
let isPrime=true;

for (let i=2;i<=(math.sqrt(random));i+=2){
    if(random%i===0) {
        isPrime=false
    }
    if(i===2){i--}
}

parentPort.postMessage({
    number:random,
    isPrime: isPrime
})
