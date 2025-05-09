const wordsList = [
    "факторіал",
    "литература",
    "сказка",
    "океан",
    "космос",
    "глушник",
    "мішечок",
    "ягня",
    "гумка",
    "ноутбук",
    "фінік",
    "ельф",
    "декада",
    "курок",
    "фельдшер",
    "балерина",
    "крейсер",
    "гантеля",
    "бандит",
    "меморіал"
];

function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * wordsList.length);
    return wordsList[randomIndex];
}

const selectedWord = getRandomWord();
const wordLength = selectedWord.length;


const guessedLetters = new Array(wordLength).fill('_');


function updateDisplay() {
    document.getElementById('word-display').textContent = guessedLetters.join(' ');
}


function checkGuess() {
    const guessInput = document.getElementById('guess-input');
    const guess = guessInput.value.toLowerCase();
    
    if (guess.length !== 1) {
        alert('Введіть одну букву!');
        return;
    }

    let hasGuessed = false;
    for (let i = 0; i < selectedWord.length; i++) {
        if (selectedWord[i] === guess) {
            guessedLetters[i] = guess;
            hasGuessed = true;
        }
    }

    updateDisplay();
    guessInput.value = '';

    if (guessedLetters.join('') === selectedWord) {
        alert('Вітаємо! Вы вгадали слово!');
    }
}

updateDisplay();


// document.addEventListener("keydown", function(){
//     let cherecter = document.getElementById("img");
//     cherecter.style.bottom += 100;
// });