/*---------------------------Shortcuts-----------------------*/

// switches between themes
document.addEventListener("keydown", (event) => {
  if (
    event.ctrlKey &&
    event.altKey &&
    (event.key === "t" || event.key === "T")
  ) {
    event.preventDefault();
    if (document.documentElement.getAttribute("data-theme") === "light") {
      darkContainer.classList.remove("hidden");
      lightContainer.classList.add("hidden");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      lightContainer.classList.remove("hidden");
      darkContainer.classList.add("hidden");
      document.documentElement.setAttribute("data-theme", "light");
    }
  }
});

// starts a new game

document.addEventListener("keydown", (event) => {
  if (
    event.ctrlKey &&
    event.shiftKey &&
    (event.key === "s" || event.key === "S")
  ) {
    numDisplay.textContent = "000";
    guessedNumber = 0;
    triesLeft = 10;
    leftTriesDisplay.textContent = triesLeft;
    resultDisplay.textContent = "";
    if (newGameBtn) {
      newGameBtn.classList.add("hidden");
    }
    goBtn.classList.remove("hidden");
    if (retryBtn) {
      retryBtn.classList.add("hidden");
    }
  }
});

/* -------------------Header-Start---------------------- */
const darkModeToggle = document.getElementsByClassName("fa-toggle-on")[0];
const lightModeToggle = document.getElementsByClassName("fa-toggle-off")[0];
const darkContainer = document.getElementsByClassName("dark-toggle")[0];
const lightContainer = document.getElementsByClassName("light-toggle")[0];
const aboutGame = document.getElementById("about-game");

darkModeToggle.addEventListener("click", () => {
  lightContainer.classList.remove("hidden");
  darkContainer.classList.add("hidden");
  document.documentElement.setAttribute("data-theme", "light");
});

lightModeToggle.addEventListener("click", () => {
  darkContainer.classList.remove("hidden");
  lightContainer.classList.add("hidden");
  document.documentElement.setAttribute("data-theme", "dark");
});

const questionMark = document.getElementsByClassName("question-div")[0];
questionMark.addEventListener("click", () => {
  if (aboutGame.classList.contains("hidden")) {
    aboutGame.classList.remove("hidden");
  } else {
    aboutGame.classList.add("hidden");
  }
});

const popUpClose = document.getElementsByClassName("fa-xmark")[0];
popUpClose.addEventListener("click", () => {
  aboutGame.classList.add("hidden");
});
/*---------------------------Header-End------------------*/

/* ----------------------Body-Start------------------- */
let bestGuess = JSON.parse(localStorage.getItem("bestGuess")) || 11;

const resultDisplay = document.getElementById("results");
let guessedNumber = 0;
const leftTriesDisplay = document.getElementById("tries-left");
let triesLeft = 10;
const numDisplay = document.getElementById("guessed-num");
const bestGuessDisplay = document.getElementById("best-guess");
const scoreDisplay = document.getElementById("player-score");

// user input validation
document.body.addEventListener("keydown", (event) => {
  if (event.key >= "0" && event.key <= "9") {
    let currentDisplay = numDisplay.textContent.trim();

    currentDisplay = currentDisplay.slice(1) + event.key;
    numDisplay.textContent = currentDisplay;

    const currentNumber = Number(currentDisplay);
    if (!isNaN(currentNumber) && currentNumber > 100) {
      resultDisplay.textContent = pickRandomMessage(numberRangeArray);
      setTimeout(() => {
        resultDisplay.textContent = "";
      }, 1500);
      numDisplay.textContent = "000";
    }
    guessedNumber = currentNumber;
  }

  if (event.key === "Backspace") {
    let currentDisplay = numDisplay.textContent.trim();
    currentDisplay = currentDisplay.slice(0, -1);
    numDisplay.textContent = currentDisplay.padStart(3, "0");
  }
});

// make computer pick a random number
function pickRandom() {
  const randomNum = Math.floor(Math.random() * 100) + 1;
  return randomNum;
}

const goBtn = document.getElementsByClassName("go-btn")[0];
const retryBtn = document.getElementsByClassName("try-again-btn")[0];
const newGameBtn = document.getElementsByClassName("new-game-btn")[0];

let random;
// the function of 'go' btn
function startGame() {
  const randomNum = pickRandom();
  checkResult(guessedNumber, randomNum);
  triesLeft--;
  goBtn.classList.add("hidden");
  retryBtn.classList.remove("hidden");
  random = randomNum;
  guessedNumber = 0;
  leftTriesDisplay.textContent = triesLeft;
}

goBtn.addEventListener("click", () => {
  if (guessedNumber) {
    startGame();
    numDisplay.textContent = "000";
  } else {
    resultDisplay.textContent = pickRandomMessage(numberPrompt);
  }
});

document.body.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (guessedNumber) {
      if (!goBtn.classList.contains("hidden")) {
        startGame();
        numDisplay.textContent = "000";
      } else if (!retryBtn.classList.contains("hidden")) {
        reattemptSameNum(guessedNumber, random);
        numDisplay.textContent = "000";
      }
    } else {
      resultDisplay.textContent = pickRandomMessage(numberPrompt);
    }
  }
});

let playerScore;
bestGuessDisplay.textContent =
  JSON.parse(localStorage.getItem("bestGuess")) || 0;

// check results
function checkResult(guessed, random) {
  if (guessed === random) {
    playerScore = 10 - triesLeft;
    scoreDisplay.textContent = playerScore;
    if (playerScore < bestGuess) {
      bestGuess = playerScore;
      localStorage.setItem("bestGuess", JSON.stringify(bestGuess));
      bestGuessDisplay.textContent = bestGuess;
    }
    resultDisplay.textContent = pickRandomMessage(congratsArray);
    newGameBtn.classList.remove("hidden");
    if (retryBtn) {
      retryBtn.classList.add("hidden");
    }
    triesLeft = 10;
  } else if (Math.abs(guessed - random) <= 10) {
    resultDisplay.textContent = pickRandomMessage(closeArray);
  } else {
    resultDisplay.textContent = pickRandomMessage(notCloseArray);
  }
}

// retry
function reattemptSameNum(guessed, random) {
  if (triesLeft > 0) {
    guessedNum = guessed;
    randomNum = random;
    triesLeft--;
    checkResult(guessedNum, randomNum);
    leftTriesDisplay.textContent = triesLeft;
  } else if (triesLeft <= 0) {
    resultDisplay.textContent =
      pickRandomMessage(outOfAttemptsArray) + ` It was ${random}.`;
    newGameBtn.classList.remove("hidden");
    retryBtn.classList.add("hidden");
  }
}

retryBtn.addEventListener("click", () => {
  if (guessedNumber) {
    reattemptSameNum(guessedNumber, random);
    numDisplay.textContent = "000";
    guessedNumber = 0;
  } else {
    resultDisplay.textContent = pickRandomMessage(numberPrompt);
  }
});

newGameBtn.addEventListener("click", () => {
  numDisplay.textContent = "000";
  guessedNumber = 0;
  triesLeft = 10;
  leftTriesDisplay.textContent = triesLeft;
  resultDisplay.textContent = "";
  if (newGameBtn) {
    newGameBtn.classList.add("hidden");
  }
  goBtn.classList.remove("hidden");
  if (retryBtn) {
    retryBtn.classList.add("hidden");
  }
});

const resetBtn = document.getElementsByClassName("best-score-reset-btn")[0];
resetBtn.addEventListener("click", () => {
  bestGuess = Infinity;
  localStorage.removeItem("bestGuess");
  bestGuessDisplay.textContent = 0;
});

// ------------------------result-arrays-----------------------

const congratsArray = [
  "W-what?! I can't believe you got it right... Tch, whatever.",
  "I-I guess you did well. Don't get used to it!",
  `I-I wasn't expecting you to guess it right... but I guess you were lucky.`,
  "D-Don't think you're so great just because you won. Baka!",
  "F-Fine, you got it. Happy now? But don't think I'm impressed or anything!",
];

const closeArray = [
  "Tch, you were close... but still wrong! Try harder, idiot.",
  "Y-You almost had it! Hmph, you're lucky I’m not mad.",
  "Close enough... I guess I’ll give you another chance. But don’t think I’ll make it easy.",
  "You're not bad... but you still missed. Try harder next time!",
  "Ugh, you were so close! But don’t think I’ll go easy on you just because of that.",
];

const notCloseArray = [
  "Hah, that’s way off! Are you even trying?",
  "No way, you’re nowhere near it! Don’t bother me with guesses like that.",
  "Tch, you’re way off. Maybe you should just give up.",
  "I-I can’t believe you guessed so far off. How embarrassing for you.",
  "I-I don’t want to say it, but you’re so far off... better luck next time!",
];

const numberRangeArray = [
  "Tch, I told you to pick a number between 1 and 100! Are you really that stupid?",
  "Ugh, why do you always mess up the range? Stick to 1-100!",
  "You had one job: pick a number between 1 and 100. How hard is it?",
  "Idiot, that's not in the range! I said 1 to 100, didn't I?",
  "Are you even paying attention? Pick a number between 1 and 100!",
];

const outOfAttemptsArray = [
  `Out of tries, huh? Pathetic.`,
  `You used all your attempts? What a waste.`,
  `Game over. You failed. Don’t even think about retrying.`,
  `Out of attempts, idiot. I don’t even care anymore.`,
  `You’ve exhausted all your tries.`,
];

const numberPrompt = [
  "You can't play without entering a number, idiot.",
  "Enter a number, or you can't play, dummy.",
  "Don't be an idiot, enter a number if you want to play.",
  "You want to play? Then enter a number, idiot.",
  "Enter a number already, or stop pretending you can play!",
];

function pickRandomMessage(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
