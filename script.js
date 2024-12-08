let maxValue;
let minValue;
let triesAllowed;
let closeRange;

const closeRangeDisplay = document.getElementById("js-close-range-display");

window.addEventListener("load", () => {
  maxValue = parseInt(localStorage.getItem("maxValue")) || 100;
  minValue = parseInt(localStorage.getItem("minValue")) || 1;
  triesAllowed = parseInt(localStorage.getItem("triesAllowed")) || 10;
  closeRange = parseInt(localStorage.getItem("closeRange")) || 10;

  triesLeft = triesAllowed;
  leftTriesDisplay.textContent = triesLeft;

  closeRangeDisplay.textContent = closeRange;

  const savedDifficulty = localStorage.getItem("selectedDifficulty") || "easy"; // Default to "easy"
  const savedRadio = document.querySelector(
    `input[name="difficulty"][value="${savedDifficulty}"]`
  );

  if (savedRadio) {
    savedRadio.checked = true;
    savedRadio.dispatchEvent(new Event("change"));
  }
});
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
/*-----------------settings------------------*/
const settingsIcon = document.getElementsByClassName("settings-div")[0];
const settings = document.getElementsByClassName("settings")[0];

settingsIcon.addEventListener("click", () => {
  settings.classList.remove("hidden");
  if (aboutGame) {
    aboutGame.classList.add("hidden");
  }
});

const settingsClose = document.getElementsByClassName("settings-close")[0];

settingsClose.addEventListener("click", () => {
  settings.classList.add("hidden");
});

const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');
const customMenu = document.getElementsByClassName("custom")[0];

difficultyRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    localStorage.setItem("selectedDifficulty", radio.value);

    switch (radio.value) {
      case "hard":
        maxValue = 999;
        minValue = 1;
        triesAllowed = 10;
        triesLeft = triesAllowed;
        leftTriesDisplay.textContent = triesLeft;
        closeRange = 30;
        closeRangeDisplay.textContent = closeRange;

        break;
      case "medium":
        maxValue = 500;
        minValue = 1;
        triesAllowed = 10;
        triesLeft = triesAllowed;
        leftTriesDisplay.textContent = triesLeft;
        closeRange = 15;
        closeRangeDisplay.textContent = closeRange;

        break;
      case "easy":
        maxValue = 100;
        minValue = 1;
        triesAllowed = 10;
        triesLeft = triesAllowed;
        leftTriesDisplay.textContent = triesLeft;
        closeRange = 10;
        break;
      case "custom":
        customMenu.classList.remove("custom");
        customMenu.classList.add("active-custom");
        closeRangeDisplay.textContent = closeRange;

        break;
    }

    localStorage.setItem("maxValue", maxValue);
    localStorage.setItem("minValue", minValue);
    localStorage.setItem("triesAllowed", triesAllowed);
    localStorage.setItem("closeRange", closeRange);
  });
});

const saveChangesBtn = document.getElementsByClassName("save-changes")[0];

saveChangesBtn.addEventListener("click", () => {
  const maxInput = document.getElementById("maximum-value");
  maxValue = parseInt(maxInput.value);
  const minInput = document.getElementById("minimum-value");
  minValue = parseInt(minInput.value);
  const triesInput = document.getElementById("tries-allowed");
  triesAllowed = parseInt(triesInput.value);
  const rangeInput = document.getElementById("close-range");
  closeRange = parseInt(rangeInput.value);

  triesLeft = triesAllowed;
  leftTriesDisplay.textContent = triesLeft;
});
/* -------------------theme---------------------- */
const darkModeRadio = document.getElementById("dark-mode-radio");
const lightModeRadio = document.getElementById("light-mode-radio");

darkModeRadio.addEventListener("click", () => {
  document.documentElement.setAttribute("data-theme", "dark");
});

lightModeRadio.addEventListener("click", () => {
  document.documentElement.setAttribute("data-theme", "light");
});

/*----------------------------about game------------*/
const aboutGame = document.getElementById("about-game");
const questionMark = document.getElementsByClassName("question-div")[0];
questionMark.addEventListener("click", () => {
  aboutGame.classList.remove("hidden");
  if (settings) {
    settings.classList.add("hidden");
  }
});

const popUpClose = document.getElementsByClassName("fa-xmark")[0];
popUpClose.addEventListener("click", () => {
  aboutGame.classList.add("hidden");
});

/* ----------------------Body------------------- */

// user input validation
const numDisplay = document.getElementById("guessed-num");

document.body.addEventListener("keydown", (event) => {
  const activeElement = document.activeElement;

  if (activeElement.tagName === "INPUT") {
    return;
  }

  if (event.key >= "0" && event.key <= "9") {
    let currentDisplay = numDisplay.textContent.trim();

    currentDisplay = currentDisplay.slice(1) + event.key;
    numDisplay.textContent = currentDisplay;

    const currentNumber = Number(currentDisplay);
    if (!isNaN(currentNumber) && currentNumber > maxValue) {
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

/*-----------------------------GAME-------------------*/
let bestGuess = JSON.parse(localStorage.getItem("bestGuess")) || Infinity;

const resultDisplay = document.getElementById("results");
let guessedNumber = 0;
const leftTriesDisplay = document.getElementById("tries-left");
let triesLeft = triesAllowed;
const bestGuessDisplay = document.getElementById("best-guess");
const scoreDisplay = document.getElementById("player-score");
const previousGuessDisplay = document.getElementById("js-previous-guess");

// make computer pick a random number
function pickRandom(minValue, maxValue) {
  const randomNum =
    Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
  return randomNum;
}

const goBtn = document.getElementsByClassName("go-btn")[0];
const retryBtn = document.getElementsByClassName("try-again-btn")[0];
const newGameBtn = document.getElementsByClassName("new-game-btn")[0];

let random;
// the function of 'go' btn
function startGame() {
  const randomNum = pickRandom(minValue, maxValue);
  checkResult(guessedNumber, randomNum);
  triesLeft--;
  goBtn.classList.add("hidden");
  retryBtn.classList.remove("hidden");
  newGameBtn.classList.remove("hidden");
  previousGuessDisplay.textContent = guessedNumber;
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
    playerScore = triesAllowed - triesLeft;
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
  } else if (Math.abs(guessed - random) <= closeRange) {
    resultDisplay.textContent = pickRandomMessage(closeArray);
  } else {
    resultDisplay.textContent = pickRandomMessage(notCloseArray);
  }
}

// retry
function reattemptSameNum(guessed, random) {
  if (triesLeft >= 1) {
    guessedNum = guessed;
    randomNum = random;
    triesLeft--;
    checkResult(guessedNum, randomNum);
    leftTriesDisplay.textContent = triesLeft;
    previousGuessDisplay.textContent = guessedNum;
  } else {
    resultDisplay.textContent =
      pickRandomMessage(outOfAttemptsArray) + ` It was ${random}.`;
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

//start a new game
newGameBtn.addEventListener("click", () => {
  numDisplay.textContent = "000";
  guessedNumber = 0;
  triesLeft = triesAllowed;
  leftTriesDisplay.textContent = triesLeft;
  resultDisplay.textContent = "";
  previousGuessDisplay.textContent = "00";
  if (newGameBtn) {
    newGameBtn.classList.add("hidden");
  }
  goBtn.classList.remove("hidden");
  if (retryBtn) {
    retryBtn.classList.add("hidden");
  }
});

//reset
const resetBtn = document.getElementsByClassName("best-score-reset-btn")[0];
resetBtn.addEventListener("click", () => {
  bestGuess = Infinity;
  localStorage.removeItem("bestGuess");
  bestGuessDisplay.textContent = 0;
});

const screenWidth = window.innerWidth;
if (screenWidth <= 1024) {
  numDisplay.addEventListener("click", () => {
    const mobileNumInput = document.createElement("input");
    mobileNumInput.type = "text";
    mobileNumInput.inputMode = "numeric";
    document.body.appendChild(mobileNumInput);
    mobileNumInput.focus();
    mobileNumInput.classList.add("mobile-num-input");

    mobileNumInput.addEventListener("input", (event) => {
      let currentDisplay = numDisplay.textContent.trim();
      const inputValue = event.data;

      if (inputValue === null) {
        currentDisplay = currentDisplay.slice(0, -1);
      } else if (/^\d$/.test(inputValue)) {
        currentDisplay = currentDisplay.slice(1) + inputValue;
      } else {
        return;
      }

      numDisplay.textContent = currentDisplay.padStart(3, "0");

      const currentNumber = Number(currentDisplay);
      if (!isNaN(currentNumber) && currentNumber > maxValue) {
        resultDisplay.textContent = pickRandomMessage(numberRangeArray);
        setTimeout(() => {
          resultDisplay.textContent = "";
        }, 1500);
        numDisplay.textContent = "000";
      }
      guessedNumber = currentNumber;
    });
  });
}
// ------------------------result-arrays-----------------------

const congratsArray = [
  "Nice! You got it right. Great job!",
  "Well done! You nailed it!",
  "You guessed it! Good work!",
  "Awesome! You got it spot on!",
  "You did it! Great guess!",
];

const closeArray = [
  "Ooh, so close! Try again—you’re almost there!",
  "Not bad! You were really close that time.",
  "Close one! Keep it up—you’ll get it soon.",
  "Good effort! You’re getting warmer.",
  "Almost there! Just a little more effort!",
];

const notCloseArray = [
  "That’s way off. Try something closer.",
  "Nope, not even close. Give it another shot!",
  "Not quite. Maybe rethink your guess?",
  "That guess was pretty far off. Keep trying!",
  "Hmm, you’re way off this time. Better luck next guess!",
];

const numberRangeArray = [
  "Make sure to pick a number within the range!",
  "Oops, that’s not in the range. Try again!",
  "Remember to choose a number between the given limits.",
  "That number’s out of range. Check the limits!",
  "Stay within the range next time, okay?",
];

const outOfAttemptsArray = [
  "You’re out of tries! Better luck next time.",
  "No more attempts left. Game over!",
  "That’s it for your tries. Give it another go later.",
  "Out of tries! Thanks for playing!",
  "All done! You’ve used up all your attempts.",
];

const numberPrompt = [
  "Enter a number to play.",
  "You need to input a number to start.",
  "Go ahead, type in a number to begin!",
  "Want to play? Just enter a number.",
  "Type in a number, and let’s get started!",
];

function pickRandomMessage(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
