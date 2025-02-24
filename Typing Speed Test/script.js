const textToTypeEl = document.getElementById("textToType");
const inputField = document.getElementById("inputField");
const timerDisplay = document.getElementById("timer");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const statsSection = document.querySelector(".stats");
const restartButton = document.getElementById("restartButton");

let timer = 0, interval = null, isTyping = false, sentence = "";

function generateRandomSentence() {
    const words = ["apple", "banana", "cherry", "dog", "elephant", "fox", "grape", "hat", "ice", "jungle", "kite", "lemon", 
            "monkey", "night", "orange", "penguin", "queen", "rabbit", "sun", "tiger", "umbrella", "violet", "whale", 
            "xylophone", "yacht", "zebra", "mountain", "river", "ocean", "forest", "desert", "guitar", "piano", "violin", 
            "happy", "sad", "excited", "fast", "slow", "bright", "dark", "morning", "evening", "breakfast", "lunch", 
            "dinner", "amazing", "awesome", "brilliant", "coding", "developer", "keyboard", "monitor", "software", 
            "hardware", "cloud", "internet", "network", "server", "laptop", "mobile", "tablet", "coffee", "energy", 
            "focus", "goal", "success", "failure", "learning", "explore", "discover", "adventure", "travel", "destination",
            "journey", "wisdom", "courage", "brave", "gentle", "kind", "hope", "dream", "believe", "create", "build",
            "friendship", "family", "teamwork", "strength", "power", "magic", "mystery", "wonder", "imagine", "vision",
            "nature", "wildlife", "planet", "space", "galaxy", "star", "moon", "earth", "wind", "storm", "thunder",
            "lightning", "rainbow", "sunshine", "snow", "autumn", "winter", "summer", "spring", "breeze", "shadow",
            "reflection", "mirror", "castle", "village", "city", "bridge", "tower", "history", "future", "present",
            "moment", "seconds", "minutes", "hours", "yesterday", "tomorrow", "holiday", "celebration", "happiness",
            "joyful", "peace", "calm", "silent", "whisper", "voice", "sound", "melody", "rhythm", "song", "poetry",
            "writing", "reading", "book", "library", "story", "legend", "fiction", "chapter", "character", "hero",
            "villain", "battle", "victory", "defeat", "challenge", "struggle", "patience", "determination", "effort",
            "hardwork", "skill", "talent", "art", "painting", "sculpture", "photography", "cinema", "theater", "drama",
            "performance", "dance", "movement", "expression", "gesture", "emotion", "feeling", "thought", "mind",
            "intelligence", "logic", "reasoning", "science", "physics", "chemistry", "biology", "experiment", "research",
            "innovation", "technology", "robot", "machine", "automation", "future", "progress", "growth", "development",
            "inspiration", "motivation", "dedication", "discipline", "habit", "routine", "consistency", "strategy"];
    const sentenceLength = Math.floor(Math.random() * 6) + 5; // 5-10 words
    sentence = Array.from({ length: sentenceLength }, () => words[Math.floor(Math.random() * words.length)]).join(" ");
    updateHighlightedText("");
}

function updateHighlightedText(typedText) {
    let highlightedText = sentence.split("").map((char, i) => {
        if (i < typedText.length) {
            return typedText[i] === char 
                ? `<span class="correct">${char}</span>` 
                : `<span class="incorrect">${char}</span>`;
        }
        return char;
    }).join("");
    textToTypeEl.innerHTML = highlightedText;
}

function startTimer() {
    if (!isTyping) {
        isTyping = true;
        interval = setInterval(() => {
            timer++;
            timerDisplay.textContent = timer;
            updateWPM();
        }, 1000);
    }
}

function updateWPM() {
    const wordsTyped = inputField.value.trim().split(/\s+/).length;
    const wpm = Math.round((wordsTyped / timer) * 60) || 0;
    wpmDisplay.textContent = wpm;
}

function calculateAccuracy() {
    const typedText = inputField.value;
    let correctChars = 0;

    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === sentence[i]) {
            correctChars++;
        }
    }

    const accuracy = ((correctChars / sentence.length) * 100).toFixed(1);
    accuracyDisplay.textContent = accuracy;
}

inputField.addEventListener("input", () => {
    if (!interval) startTimer();
    updateWPM();
    calculateAccuracy();
    updateHighlightedText(inputField.value);

    if (inputField.value.length >= sentence.length) {
        clearInterval(interval);
        interval = null;
        isTyping = false;
        inputField.disabled = true;
        statsSection.style.display = "block";
    }
});

restartButton.addEventListener("click", () => {
    clearInterval(interval);
    interval = null;
    isTyping = false;
    timer = 0;
    inputField.value = "";
    inputField.disabled = false;
    timerDisplay.textContent = "0";
    wpmDisplay.textContent = "0";
    accuracyDisplay.textContent = "100";
    statsSection.style.display = "none";
    generateRandomSentence();
});

generateRandomSentence();
