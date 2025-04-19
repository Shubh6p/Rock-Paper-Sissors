const startGameButton = document.getElementById("startGame");
const roundsInput = document.getElementById("rounds");
const errorMessage = document.querySelector(".error-message");
const userScoreDisplay = document.getElementById("userScore");
const botScoreDisplay = document.getElementById("botScore");

const gameContainer = document.querySelector(".container");
const userResult = document.querySelector(".user_result img");
const botResult = document.querySelector(".bot_result img");
const result = document.querySelector(".result");
const optionImages = document.querySelectorAll(".option_image");

const botImages = ["images/rock.png", "images/paper.png", "images/scissors.png"];
const outcomes = {
  RR: "Draw",
  RP: "BOT",
  RS: "YOU",
  PP: "Draw",
  PR: "YOU",
  PS: "BOT",
  SS: "Draw",
  SR: "BOT",
  SP: "YOU"
};

let totalRounds = 0;
let currentRound = 0;
let userScore = 0;
let botScore = 0;
let drawRounds = 0;

startGameButton.addEventListener("click", () => {
  const rounds = parseInt(roundsInput.value, 10);

  if (rounds % 2 === 0) {
    errorMessage.textContent = "Please select an odd number of rounds!";
    return;
  }

  errorMessage.textContent = "";
  totalRounds = rounds;
  currentRound = 0;
  userScore = 0;
  botScore = 0;
  drawRounds = 0;

  userScoreDisplay.textContent = "0";
  botScoreDisplay.textContent = "0";

  result.textContent = `Game Started! Best of ${totalRounds} rounds`;
});

function handleOptionClick(event) {
  if (currentRound >= totalRounds) return;

  const clickedImage = event.currentTarget;
  const clickedIndex = Array.from(optionImages).indexOf(clickedImage);

  userResult.src = botResult.src = "images/rock.png";
  result.textContent = "Wait...";

  optionImages.forEach((image, index) => {
    image.classList.toggle("active", index === clickedIndex);
  });

  gameContainer.classList.add("start");

  setTimeout(() => {
    gameContainer.classList.remove("start");

    const userImageSrc = clickedImage.querySelector("img").src;
    userResult.src = userImageSrc;

    const randomNumber = Math.floor(Math.random() * botImages.length);
    const botImageSrc = botImages[randomNumber];
    botResult.src = botImageSrc;

    const userValue = ["R", "P", "S"][clickedIndex];
    const botValue = ["R", "P", "S"][randomNumber];
    const outcomeKey = userValue + botValue;
    const outcome = outcomes[outcomeKey] || "Unknown";

    if (userValue === botValue) {
      drawRounds++;
      result.textContent = "Round Draw! 🤝";
    } else {
      if (outcome === "YOU") {
        userScore++;
        userScoreDisplay.textContent = userScore;
      } else {
        botScore++;
        botScoreDisplay.textContent = botScore;
      }
      result.textContent = `${outcome} WON!`;
    }

    currentRound++;

    if (currentRound >= totalRounds) {
      setTimeout(() => {
        if (userScore > botScore) {
          result.textContent = `YOU won the Game! Best of ${totalRounds} rounds. You won ${userScore} rounds! 🎉`;
        } else if (botScore > userScore) {
          result.textContent = `BOT won the Game! Best of ${totalRounds} rounds. Bot won ${botScore} rounds! 🤖`;
        } else {
          result.textContent = `Overall Game Draw! 🤝 Both won ${userScore} rounds, ${drawRounds} rounds were tied!`;
        }
      }, 1000);
    }
  }, 2000);
}