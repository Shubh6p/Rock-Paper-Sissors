// Elements
const darkModeToggle = document.getElementById("darkModeToggle");
const roundsInput = document.getElementById("rounds");
const startGameBtn = document.getElementById("startGame");
const resetGameBtn = document.getElementById("resetGame");
const errorMessage = document.querySelector(".error-message");
const difficultySelect = document.getElementById("difficulty");

const userScoreSpan = document.getElementById("userScore");
const botScoreSpan = document.getElementById("botScore");

const userResultImg = document.querySelector(".user_result img");
const botResultImg = document.querySelector(".bot_result img");

const resultText = document.querySelector(".result");
const optionButtons = document.querySelectorAll(".option_image");

const winSound = document.getElementById("winSound");
const loseSound = document.getElementById("loseSound");
const drawSound = document.getElementById("drawSound");

// Game state
let roundsToPlay = 0;
let roundsPlayed = 0;
let userScore = 0;
let botScore = 0;
let gameActive = false;
let userLastChoice = null;

const choices = ["rock", "paper", "scissors"];
const choiceImages = {
  rock: "rock.png",
  paper: "paper.png",
  scissors: "scissors.png",
};

// Dark Mode Toggle
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  darkModeToggle.setAttribute("aria-pressed", isDark);
  darkModeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
});

// Start Game
startGameBtn.addEventListener("click", () => {
  const val = Number(roundsInput.value);
  if (!val || val < 1) {
    errorMessage.textContent = "Please enter a valid number greater than 0.";
    return;
  }
  if (val % 2 === 0) {
    errorMessage.textContent = "Please select an odd number of rounds.";
    return;
  }
  const winningScore = Math.ceil(val / 2);
  errorMessage.textContent = `You have selected ${val} rounds. First to score ${winningScore} will win the game.`;
  roundsToPlay = val;
  
  roundsPlayed = 0;
  userScore = 0;
  botScore = 0;
  gameActive = true;
  userScoreSpan.textContent = "0";
  botScoreSpan.textContent = "0";
  resultText.textContent = "Game Started! Make your move.";
  resetGameBtn.disabled = false;

  optionButtons.forEach(btn => btn.disabled = false);
});

// Reset Game
resetGameBtn.addEventListener("click", resetGame);

function resetGame() {
  roundsToPlay = 0;
  roundsPlayed = 0;
  userScore = 0;
  botScore = 0;
  gameActive = false;
  roundsInput.value = "";
  errorMessage.textContent = "";
  userScoreSpan.textContent = "0";
  botScoreSpan.textContent = "0";
  resultText.textContent = "Let's Play!";
  resetGameBtn.disabled = true;

  userResultImg.src = choiceImages["rock"];
  botResultImg.src = choiceImages["rock"];
  optionButtons.forEach(btn => btn.disabled = true);
}

// Play Round Logic
optionButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (!gameActive) return;

    const userChoice = btn.getAttribute("aria-label").toLowerCase();
    userLastChoice = userChoice;
    const difficulty = difficultySelect.value;

    const botChoice = difficulty === "hard" ? getBotCheatChoice(userChoice) : getRandomChoice();

    userResultImg.src = choiceImages[userChoice];
    botResultImg.src = choiceImages[botChoice];

    const winner = getRoundWinner(userChoice, botChoice);
    roundsPlayed++;

    if (winner === "user") {
      userScore++;
      userScoreSpan.textContent = userScore;
      resultText.textContent = "You Win this round! Make your next Move";
      playSound(winSound);
    } else if (winner === "bot") {
      botScore++;
      botScoreSpan.textContent = botScore;
      resultText.textContent = "Bot Wins this round! Make your next Move";
      playSound(loseSound);
    } else {
      resultText.textContent = "It's a Draw! Make your next Move";
      playSound(drawSound);
    }

    optionButtons.forEach(b => b.disabled = true);
    setTimeout(() => {
      if (gameActive) optionButtons.forEach(b => b.disabled = false);
    }, 600);

    if (isGameOver()) {
      gameActive = false;

      let finalMessage = "";
      if (userScore > botScore) {
        finalMessage = `🎉 You won the match! Final Score - You: ${userScore}, Bot: ${botScore}`;
      } else if (botScore > userScore) {
        finalMessage = `🤖 Bot won the match! Final Score - Bot: ${botScore}, You: ${userScore}`;
      } else {
        finalMessage = `🤝 It's a Tie! Final Score - You: ${userScore}, Bot: ${botScore}`;
      }

      resultText.textContent = finalMessage;
    }
  });
});

function getRandomChoice() {
  return choices[Math.floor(Math.random() * choices.length)];
}

function getBotCheatChoice(userChoice) {
  switch (userChoice) {
    case "rock": return "paper";
    case "paper": return "scissors";
    case "scissors": return "rock";
    default: return getRandomChoice();
  }
}

function getRoundWinner(user, bot) {
  if (user === bot) return "draw";
  if (
    (user === "rock" && bot === "scissors") ||
    (user === "paper" && bot === "rock") ||
    (user === "scissors" && bot === "paper")
  ) return "user";
  return "bot";
}

function isGameOver() {
  const majority = Math.ceil(roundsToPlay / 2);
  return userScore === majority || botScore === majority || roundsPlayed === roundsToPlay;
}

function playSound(sound) {
  if (!sound) return;
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

// Initialize game as disabled
resetGame();
