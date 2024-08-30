const { workerData, parentPort } = require("worker_threads");
const math = require("math");
const blackMult = 1.2;
const whiteMult = 1.6;
const blueMult = 3.0;
const greenMult = 16.0;
const blackNumbers = [
  2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40,
];
const whiteNumbers = [3, 7, 9, 13, 15, 19, 21, 23, 27, 29, 33, 35, 39];
const blueNumbers = [5, 11, 17, 25, 31, 37];
let currentBets = [];

setInterval(() => {
  spin(currentBets);
}, 28000); // later change to 20000+8000(spin wait+time)

parentPort.on("message", (bets) => {
  console.log("Received message from main thread:", bets);

  for (const [key, value] of Object.entries(bets)) {
    currentBets.push(value);
  }
});

function spin(bets) {
  let rollNumberValues = rollNumbers(); //roll random numbers, returns as array
  let randomInner = rollNumberValues[0],
    randomOuter = rollNumberValues[1],
    colorInner = rollNumberValues[2],
    colorOuter = rollNumberValues[3];

  let wins = calculateWinnings(bets, colorInner, colorOuter);
  parentPort.postMessage({
    numberInner: randomInner,
    numberOuter: randomOuter,
    colorInner: colorInner,
    colorOuter: colorOuter,
    wins: wins,
  });

  currentBets = [];
}

function rollNumbers() {
  let randomInner, randomOuter, colorOuter, colorInner;
  randomInner = math.floor(math.random() * 40) + 1;
  randomOuter = math.floor(math.random() * 40) + 1;
  colorInner = checkNumberColor(randomInner);
  colorOuter = checkNumberColor(randomOuter);
  return [randomInner, randomOuter, colorInner, colorOuter];
}

function calculateWinnings(bets, colorInner, colorOuter) {
  let winnings = [];

  bets.forEach((element, index) => {
    let win = element[0];
    let startBet = win;
    // console.log(element[1])
    if (element[1] === colorOuter) {
      switch (colorOuter) {
        case "black":
          win *= blackMult;
          break;
        case "white":
          win *= whiteMult;
          break;
        case "blue":
          win *= blueMult;
          break;
        case "green":
          win *= greenMult;
          break;
      }
    }
    if (element[1] === colorInner) {
      switch (colorInner) {
        case "black":
          win *= blackMult;
          break;
        case "white":
          win *= whiteMult;
          break;
        case "blue":
          win *= blueMult;
          break;
        case "green":
          win *= greenMult;
          break;
      }
    }
    if (win === startBet) {
      win = 0;
    }
    winnings.push([win, bets[index][2]]);
  });
  return winnings;
}

function checkNumberColor(number) {
  let colorOfNumber;
  if (blackNumbers.includes(number)) {
    colorOfNumber = "black";
  } else if (whiteNumbers.includes(number)) {
    colorOfNumber = "white";
  } else if (blueNumbers.includes(number)) {
    colorOfNumber = "blue";
  } else if (number === 1) {
    colorOfNumber = "green";
  }
  return colorOfNumber;
}

//