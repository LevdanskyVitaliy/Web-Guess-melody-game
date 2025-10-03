let isPlaying = false;
let isUserTurn = false;
let sequence = [];
let userSequence = [];
let level = 1;
let correctRepeats = 0;
let volume = 0.7;
let allKeys = [];

const initGame = () => {
  // let audio = new Audio();

  // piano consts
  const pianoKeys = document.querySelectorAll(".piano-keys .key");
  const volumeSlider = document.querySelector(".volume-slider input");
  const keysCheckbox = document.querySelector(".keys-checkbox input");

  const playTune = async (key) => {
    try {
      const response = await fetch(`tunes/${key}.wav`);
      const audioData = await response.blob();
      const audioURL = URL.createObjectURL(audioData);
      const sound = new Audio(audioURL);
      await sound.play();
      console.log("success with hecking API");

      // const playTuneO = (key) => {
      //   audio.src = `tunes/${key}.wav`;
      //   audio.play();

      const clickedKey = document.querySelector(`[data-key="${key}"]`);
      clickedKey.classList.add("bg-gray-200", "scale-95", "text-2xl");
      clickedKey.classList.contains("white")
        ? clickedKey.classList.add("text-gray-900")
        : clickedKey.classList.add("text-white", "bg-gray-900");

      setTimeout(() => {
        clickedKey.classList.remove(
          "bg-gray-200",
          "bg-gray-900",
          "scale-95",
          "text-2xl",
          "text-gray-900",
          "text-white"
        );
      }, 200);
      URL.revokeObjectURL(audioURL);
    } catch (error) {
      console.error("Loading is failed with error - " + error);
    }
  };

  // listner  play on click
  pianoKeys.forEach((key) => {
    allKeys.push(key.dataset.key);
    key.addEventListener("click", () => playTune(key.dataset.key));
    key.addEventListener("click", () => handleKeyPress(key.dataset.key));
  });
  console.log(allKeys);
  // pressed sound
  const pressedSound = (e) => {
    if (allKeys.includes(e.key) && isPlaying && isUserTurn) {
      playTune(e.key);
      console.log(e.key);
      handleKeyPress(e.key);
    }

    if (allKeys.includes(e.key)) {
      playTune(e.key);
    }
  };

  // audio volume
  const handleVolume = (e) => {
    audio.volume = e.target.value;
  };

  // show the keys
  const showTheKeys = () => {
    const pianoKeysSpan = document.querySelectorAll(".piano-keys .key span");
    pianoKeysSpan.forEach((key) => {
      key.classList.toggle("hidden");
    });
  };

  keysCheckbox.addEventListener("click", showTheKeys);
  volumeSlider.addEventListener("input", handleVolume);
  document.addEventListener("keydown", pressedSound);
};

// Game consts
const gameStatus = document.getElementById("game-status");
const startButton = document.getElementById("start-btn");
const repeatButton = document.getElementById("repeat-btn");
const sequenceLenBtn = document.getElementById("sequence-length");
const levelDisplay = document.getElementById("level");

// GAME FUNCTIONS AND SO ON AND SO ON

const sleep = (ms, result) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(result), ms);
  });

const startGame = () => {
  isPlaying = true;
  sequence = [];
  level = 1;
  correctRepeats = 0;
  document.body.style.backgroundColor = "#DBEAFE";
  startButton.classList.add("hidden");
  repeatButton.classList.remove("hidden");
  gameStatus.innerHTML = "Слушайте мелодию...";
  levelDisplay.textContent = level;

  generateSequence();
  playSequence();
};

const generateSequence = () => {
  console.log(allKeys);
  const sequenceLength = 3 + Math.floor(level / 2);
  sequence = [];
  console.log("sequence len =.  " + sequenceLength);

  for (let i = 0; i < sequenceLength; i++) {
    const randomIndex = Math.floor(Math.random() * allKeys.length);
    sequence[i] = allKeys[randomIndex];
    console.log("iwejiqoare -   " + sequence[i]);
  }
  console.log("array of sequence -   " + sequence);

  sequenceLenBtn.textContent = sequenceLength;
};

const repeatSequence = async () => {
  gameStatus.textContent = "Слушаем еще раз";
  await sleep(2000);
  await playSequence();
};

const playSequence = async () => {
  isUserTurn = false;
  gameStatus.textContent = "Слушайте мелодию...";

  await sleep(2000, "Promise is working").then((result) => {
    console.log(result);
  });

  for (let i = 0; i < sequence.length; i++) {
    const key = sequence[i];
    repeatButton.disabled = true;
    repeatButton.classList.add("opacity-50");
    await playComputerNote(key);
  }

  repeatButton.disabled = false;
  repeatButton.classList.remove("opacity-50");
  isUserTurn = true;
  userSequence = [];
  gameStatus.textContent = "Ваш ход! Введите мелодию";
};

const playComputerNote = async (key) => {
  try {
    const audio = new Audio(`tunes/${key}.wav`);
    audio.volume = volume;
    console.log("audio computer is playing");
    audio.play();

    await new Promise((resolve) => {
      setTimeout(() => resolve(), 2000);
    });
  } catch (error) {
    console.log("Ошибка воспроизведения:", error);
  }
};

const handleKeyPress = (keyChar) => {
  if (!isPlaying || !isUserTurn) {
    return;
  }

  console.log("handleKeyPress called with:", keyChar);
  console.log("isPlaying:", isPlaying, "isUserTurn:", isUserTurn);

  userSequence.push(keyChar);

  console.log("user sequence +++ ", userSequence);
  console.log("noteisPlaying " + keyChar);
  checkUserInput();
};

const checkUserInput = () => {
  const currentIndex = userSequence.length - 1;
  console.log("CURRENT INDEX - ", currentIndex);

  console.log("SEQUENCE LEN ----- is --- ", sequence.length);

  if (sequence[currentIndex] !== userSequence[currentIndex]) {
    gameOver();

    // setTimeout(() => {
    gameStatus.textContent = `Игра окончена! Вы дошли до уровня ${level}`;
    // }, 1500);

    document.body.style.backgroundColor = "#dc2626";
    return;
  }

  repeatButton.disabled = true;
  if (sequence.length === userSequence.length) {
    correctRepeats++;
    userSequence = [];
    console.log("CURRENT INDEX - ", currentIndex);
  }

  if (correctRepeats >= 2) {
    level++;
    correctRepeats = 0;

    // here will be the higest level and func for WIN
    if (level === 5) {
      gameStatus.textContent = `Вы победили!!!!`;
      document.body.style.backgroundColor = "#00FF00";

      setTimeout(() => {
        gameOver();
      }, 3000);
      return;
    }

    repeatButton.disabled = false;
    gameStatus.textContent = `Молодцы! Вы переходите на уровень ${level}`;
    setTimeout(() => {
      generateSequence();
      playSequence();
    }, 2000);
  } else {
    gameStatus.textContent = "Правильно! Введите последовтельность еще раз";
  }

  sequenceLenBtn.textContent = sequence.length;
  levelDisplay.textContent = level;
};

const gameOver = () => {
  let isPlaying = false;
  let isUserTurn = false;
  console.log("is playing - ", isPlaying, "User turn is -", isUserTurn);

  let level = 1;
  startButton.classList.remove("hidden");
  repeatButton.classList.add("hidden");
};

// event listners

document.addEventListener("DOMContentLoaded", () => {
  initGame();
  startButton.addEventListener("click", startGame);
  repeatButton.addEventListener("click", repeatSequence);
});
