const wordsPool = "The quick brown fox jumps over the lazy dog. Practice makes perfect. Speed and accuracy matter in typing. Consistency leads to mastery. Keyboard skills enhance productivity. Focus is key to fast typing. Typing tests improve reflexes. Developing muscle memory is crucial for efficient typing. Training daily enhances accuracy. A professional typist values precision over speed. Better typing skills improve workflow and communication. Typing fast is an essential skill in the digital age. Typing efficiency helps in better job performance.".split(" ");
        
let username = "";
let timer = 60, interval = null, isTyping = false, selectedTime = 60;
let correctChars = 0, totalCharsTyped = 0, startTime = null;
let sentence = "", currentIndex = 0;

const loginPage = document.getElementById("loginPage");
const typingTest = document.getElementById("typingTest");
const finalResultEl = document.getElementById("finalResult");

const sentenceEl = document.getElementById("sentence");
const timerDisplay = document.getElementById("timeLeft");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const resultTextEl = document.getElementById("resultText");
const restartButton = document.getElementById("restartButton");

function generateSentence() {
    let wordsCount = Math.floor(selectedTime / 2.5);
    return wordsPool.sort(() => Math.random() - 0.5).slice(0, wordsCount).join(" ");
}

function displaySentence() {
    sentenceEl.innerHTML = sentence.split("").map((char, index) =>
        `<span id="char-${index}">${char}</span>`).join("");
}

function startGame() {
    username = document.getElementById("username").value.trim();
    if (!username) {
        alert("Please enter your name.");
        return;
    }
    
    selectedTime = parseInt(document.getElementById("timeSelect").value);
    timer = selectedTime;
    timerDisplay.textContent = timer;
    
    loginPage.style.display = "none";
    typingTest.style.display = "block";
    
    resetGame();
}

function resetGame() {
    sentence = generateSentence();
    displaySentence();
    currentIndex = 0;
    correctChars = 0;
    totalCharsTyped = 0;
    isTyping = false;
    
    clearInterval(interval);
    timer = selectedTime;
    timerDisplay.textContent = timer;
    wpmDisplay.textContent = "0";
    accuracyDisplay.textContent = "100";
    
    document.body.addEventListener("keydown", handleTyping);
}

function handleTyping(event) {
    if (timer <= 0) return;

    let charSpans = document.querySelectorAll("#sentence span");
    let typedChar = event.key;

    if (!isTyping) {
        isTyping = true;
        startTime = new Date();
        interval = setInterval(() => {
            timer--;
            timerDisplay.textContent = timer;
            updateWPM();
            if (timer <= 0) {
                clearInterval(interval);
                document.body.removeEventListener("keydown", handleTyping);
                showFinalResults();
            }
        }, 1000);
    }

    if (typedChar === sentence[currentIndex]) {
        charSpans[currentIndex].classList.add("correct");
        correctChars++;
    } else {
        charSpans[currentIndex].classList.add("incorrect");
    }

    totalCharsTyped++;
    currentIndex++;

    updateWPM();
    calculateAccuracy();

    if (currentIndex === sentence.length) {
        sentence = generateSentence();
        displaySentence();
        currentIndex = 0;
    }
}

function updateWPM() {
    if (!startTime) return;
    let elapsedTime = (new Date() - startTime) / 60000;
    let wordsTyped = totalCharsTyped / 5;
    let wpm = Math.round(wordsTyped / elapsedTime) || 0;
    wpmDisplay.textContent = wpm;
}

function calculateAccuracy() {
    let accuracy = totalCharsTyped === 0 ? 100 : ((correctChars / totalCharsTyped) * 100).toFixed(1);
    accuracyDisplay.textContent = accuracy;
}

function showFinalResults() {
    resultTextEl.innerHTML = `<strong>${username}</strong>, your final WPM is <strong>${wpmDisplay.textContent}</strong> and accuracy is <strong>${accuracyDisplay.textContent}%</strong>.`;
    typingTest.style.display = "none";
    finalResultEl.style.display = "block";
}

function restartTest() {
    finalResultEl.style.display = "none";
    loginPage.style.display = "block";
}

restartButton.addEventListener("click", resetGame);
loginPage.style.display = "block";
