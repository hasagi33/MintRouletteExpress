const { workerData, parentPort } = require('worker_threads')
const math=require('math')
const purpleMult=1.2;
const whiteMult=1.95;
const redMult=3.0;
const pinkMult=5.6;
const greenMult=16.0;
let currentBets=[]

setInterval(()=>{
    parentPort.postMessage({});
    spin(currentBets)},10000)


parentPort.on('message', (bets) => {
    console.log('Received message from main thread:' ,bets);

    for (const [key, value] of Object.entries(bets)) {
        console.log(`${key}: ${value}`);
        currentBets.push(value);
    }

    console.log(currentBets,"CURRENTBETS")
});

function spin(bets){
    let rollNumberValues = rollNumbers()  //roll random numbers, returns as array
    let randomInner = rollNumberValues[0]
        , randomOuter = rollNumberValues[1]
        , colorInner = rollNumberValues[2]
        , colorOuter = rollNumberValues[3]

    console.log(bets,"BETS FROM PLACEBET")

    let wins=calculateWinnings(bets, colorInner, colorOuter)
    console.log(wins,"SPIN WINS HERE")
    parentPort.postMessage({
        numberInner: randomInner,
        numberOuter: randomOuter,
        colorInner: colorInner,
        colorOuter: colorOuter,
        wins:wins
    })

    currentBets=[]
}


function rollNumbers() {
    let randomInner,randomOuter,colorOuter,colorInner
    randomInner = math.floor(math.random() * 40) + 1
    randomOuter = math.floor(math.random() * 40) + 1
    colorInner = checkNumberColor(randomInner);
    colorOuter = checkNumberColor(randomOuter);
    return [randomInner,randomOuter,colorInner,colorOuter];
}

function calculateWinnings(bets,colorInner,colorOuter){
    let winnings=[]

    console.log(bets,"BETS HEREEEEE")

    bets.forEach((element,index)=>{
        let win=element[0];
        let startBet=win;
        // console.log(element[1])
        if(element[1]===colorOuter) {
                switch (colorOuter) {
            case "purple":
                win *=purpleMult
                break;
            case "white":
                win *=whiteMult
                break;
            case "red":
                win *=redMult
                break;
            case "pink":
                win *=pinkMult
                break;
            case "green":
                win *=greenMult
                break;
            }
        }
        if(element[1]===colorInner){
                switch (colorInner) {
            case "purple":
                win *=purpleMult
                break;
            case "white":
                win *=whiteMult
                break;
            case "red":
                win *=redMult
                break;
            case "pink":
                win *=pinkMult
                break;
            case "green":
                win *=greenMult
                break;
             }
        }
        console.log(winnings,"WINNINGS HERE ")
        if(win===startBet){win=0}
        winnings.push([win,bets[index][2]])
    })
    return winnings;
}

function checkNumberColor(number){
    let colorOfNumber;
    if (number % 2 === 0) {
        colorOfNumber = "purple"
    } else if ((number + 1) % 4 === 0) {
        colorOfNumber = "white"
    } else if (((number - 1) % 4 === 0) && ((number + 3) % 8 !== 0) && number !== 1) {
        colorOfNumber = "red"
    } else if ((number - 1) % 4 === 0 && number !== 1) {
        colorOfNumber = "pink"
    } else if (number === 1) {
        colorOfNumber = "green"
    }
    return colorOfNumber;
}



