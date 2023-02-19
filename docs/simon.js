// Selecting elements
const powerBtn = document.querySelector(".power-btn");
const startBtn = document.querySelector(".start-btn");
const quarter = Array.from(document.querySelectorAll(".quarter"));
const level = document.querySelector("#level");
const blank = document.querySelector("#blank");
const message = document.querySelector("#message");
const messageContainer = document.querySelector("#message-container");
const instructions = document.querySelector(".instruction-container .heading");
const modeBtn = document.querySelector(".mode-btn");

const audio1 = document.querySelector("#beep1");
const audio2 = document.querySelector("#beep2");
const audio3 = document.querySelector("#beep3");
const audio4 = document.querySelector("#beep4");
const audios = [audio1, audio2, audio3, audio4];
const errorBeep = document.querySelector("#error-beep");
const failBeep = document.querySelector("#fail-beep");
const winBeep = document.querySelector("#win-beep");
const buttonBeep = document.querySelector("#button-beep");
const tryBeep = document.querySelector("#try-beep");
const startBeep = document.querySelector("#start-beep");
const gameWonBeep = document.querySelector("#game-won-beep");


// Declaring variables
let pattern = [];
let power = false;
let levelCount = 0;
let userTurn = false;
let intro = true;
let strictMode = false;
let error = false;
let flash = undefined;


// Adding event listeners
powerBtn.addEventListener("click", (e) => {
    buttonBeep.play();
    if (power) {
        power = false;
    } else {
        power = true;
        startBeep.play();
    }
    powerStatus();
    updatePoints();
});

startBtn.addEventListener("click", () => {
    startBtn.classList.remove("focus");
    if (power) {
        if (!userTurn) {
            playPattern(500);
        }
    }

});

instructions.addEventListener("click", () => {
    if (instructions.parentElement.classList.contains("show-instructions")) {
        instructions.parentElement.classList.remove("show-instructions");
    } else {
        instructions.parentElement.classList.add("show-instructions");
    }

});

modeBtn.addEventListener("click", () => {
    buttonBeep.play();
    if (modeBtn.getAttribute("data-strict-mode") == 0) {
        modeBtn.setAttribute("data-strict-mode", "1");
        modeBtn.querySelector("img").src = "images/hard.png";
        modeBtn.querySelector(".mode-text").innerText = "Hard";
        strictMode = true;
    } else {
        modeBtn.setAttribute("data-strict-mode", "0");
        modeBtn.querySelector("img").src = "images/easy.png";
        modeBtn.querySelector(".mode-text").innerText = "Easy";
        strictMode = false;
    }
})

events();

// Defining functions

function playPattern(time) {
    if (levelCount <= 10) {
        let count = 0;
        flashRandomElement(time);
        let simon = setInterval(() => {
            if (count <= levelCount + 1) {
                count++;
                flashRandomElement(time);
            } else {
                clearInterval(simon);
                userTurn = true;
                playFlash();
            }
        }, time + 200);
    } else {
        showMessage(11);
    }
}

function flashRandomElement(time) {
    let index = Math.floor(Math.random() * 4);
    let element = quarter[index];
    flashColor(index, time);
    audios[index].play();
    pattern.push(element);
}

function flashColor(index, time) {
    let color;
    switch (index) {
        case 0: color = "lightgreen";
            break;

        case 1: color = "tomato";
            break;

        case 2: color = "yellow";
            break;

        case 3: color = "lightskyblue";
            break;
    }
    quarter[index].style.backgroundColor = color;

    if (!(time === undefined)) {
        setTimeout(() => {
            defaultColor();
        }, time);
    }
}

function defaultColor() {
    quarter.forEach((e) => {
        e.style.removeProperty("background-color");
    })
}

function playFlash() {
    if (flash !== undefined) {
        clearInterval(flash);
        flash = undefined;
    }
    if (intro) {
        if (pattern.length > 0) {
            flash = setInterval(() => {
                flashColor(quarter.indexOf(pattern[0]), 1000);
            }, 1800);
        }
    }
}

function events() {
    quarter.forEach((element, index) => {
        element.addEventListener("click", () => {
            if (userTurn) {
                if (matchElement(element)) {
                    audios[index].play();
                    playFlash();
                } else {
                    intro ? errorBeep.play() : "";
                }
            }
            else {
                if (pattern.length === 0) {
                    errorBeep.play();
                    startBtn.classList.add("focus");
                }
            }
        });

        // Using conditonal operator instead of if else
        element.addEventListener("mousedown", () => {
            userTurn ? flashColor(index) : "";
        });
        element.addEventListener("touchstart", () => {
            userTurn ? flashColor(index) : "";
        });

        element.addEventListener("mouseup", () => {
            userTurn ? defaultColor() : "";
        });
        element.addEventListener("touchend", () => {
            userTurn ? defaultColor() : "";
        });
    })
}

function matchElement(element) {
    if (pattern[0] === element) {
        pattern.shift();
        if (pattern.length === 0) {
            levelCount++;
            updatePoints();
            userTurn = false;
            showMessage(levelCount);
        }
        return true;
    } else {
        level.innerText = "NO!";
        setTimeout(() => {
            updatePoints();
        }, 500);
        if (!intro) {
            userTurn = false;
            pattern = [];
            if (strictMode) {
                levelCount = 0;
                updatePoints();
                showMessage(12);
            } else {
                showMessage();
            }
        }
        return false;
    }
}

function updatePoints() {
    if (power) {
        if (levelCount === 0) {
            level.innerText = "0";
        } else {
            level.innerText = levelCount;
        }
    } else {
        level.innerText = "-";
    }
}

function showMessage(number) {
    let text = undefined;
    switch (number) {
        case 1: text = "Well Done!";
            winBeep.play();
            intro = false;
            playFlash();
            break;

        case 2: text = "Keep up the progress";
            winBeep.play();
            break;

        case 3: text = "Good going today!";
            winBeep.play();
            break;

        case 4: text = "Great job!";
            winBeep.play();
            break;

        case 5: text = "Must be your lucky day";
            winBeep.play();
            break;

        case 6: text = "You are a pro!";
            winBeep.play();
            break;

        case 7: text = "Wow! just Wow!";
            winBeep.play();
            break;

        case 8: text = "You are on fire today";
            winBeep.play();
            break;

        case 9: text = "OMG! Last level ahead";
            winBeep.play();
            break;

        case 10: text = "Congratulations! You won";
            winBeep.play();
            break;

        case 11: text = "Game has ended Reload page";
            gameWonBeep.play();
            break;

        case 12: text = "Ohh no! back to level 0";
            failBeep.play();
            break;

        default: text = "OOps! Try again";
            tryBeep.play();
            error = false;
            break;
    }

    message.innerText = text;
    messageContainer.style.opacity = "1";
    setTimeout(() => {
        messageContainer.style.opacity = "0";
    }, 2000);
}

function powerStatus() {
    let powerImg = powerBtn.querySelector("img");
    if (power) {
        powerImg.src = "images/power-on.png";
        powerImg.classList.remove("focus");
        blank.style.display = "none";
        if (intro) {
            startBtn.classList.add("focus");
        }
    } else {
        powerImg.src = "images/power-off.png";
        blank.style.removeProperty("display");
        startBtn.classList.remove("focus");
    }
}