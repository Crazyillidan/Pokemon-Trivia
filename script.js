
const quizData = [
    {
        question: "Who is the final evolution of Bulbasaur?",
        options: ["Ivysaur", "Venusaur", "Charizard", "Butterfree"],
        correct: "Venusaur"
    },
    {
        question: "Which type is super effective against Water?",
        options: ["Fire", "Ground", "Electric", "Ice"],
        correct: "Electric"
    },
    {
        question: "What item is used to catch Pokémon?",
        options: ["Potion", "Poké Ball", "Antidote", "Repel"],
        correct: "Poké Ball"
    },
    {
        question: "Which Pokémon is known as the 'Mouse Pokémon'?",
        options: ["Pikachu", "Rattata", "Sandshrew", "Meowth"],
        correct: "Pikachu"
    },
    {
        question: "How many evolutions does Eevee currently have?",
        options: ["3", "5", "8", "10"],
        correct: "8"
    },
    {
        question: "Who is the legendary Pokémon of Time?",
        options: ["Palkia", "Dialga", "Giratina", "Arceus"],
        correct: "Dialga"
    },
    {
        question: "Which of these is NOT a Fire-type Pokémon?",
        options: ["Charmander", "Ponyta", "Vulpix", "Squirtle"],
        correct: "Squirtle"
    },
    {
        question: "What is the name of the region in the first generation games?",
        options: ["Johto", "Hoenn", "Kanto", "Sinnoh"],
        correct: "Kanto"
    },
    {
        question: "Which Pokémon is famous for sleeping and blocking paths?",
        options: ["Snorlax", "Slowpoke", "Psyduck", "Slaking"],
        correct: "Snorlax"
    },
    {
        question: "What level does Magikarp evolve into Gyarados?",
        options: ["15", "20", "25", "30"],
        correct: "20"
    },
    {
        question: "Which berry cures paralysis?",
        options: ["Oran Berry", "Cheri Berry", "Pecha Berry", "Rawst Berry"],
        correct: "Cheri Berry"
    },
    {
        question: "Who is the leader of Team Rocket?",
        options: ["James", "Giovanni", "Jessie", "Cyrus"],
        correct: "Giovanni"
    },
    {
        question: "Which Pokémon is #001 in the National Pokédex?",
        options: ["Pikachu", "Bulbasaur", "Mew", "Arceus"],
        correct: "Bulbasaur"
    },
    {
        question: "What type is immune to Ghost-type moves?",
        options: ["Normal", "Dark", "Psychic", "Fighting"],
        correct: "Normal"
    },
    {
        question: "Which fossil Pokémon is resurrected from the Helix Fossil?",
        options: ["Kabuto", "Aerodactyl", "Omanyte", "Lileep"],
        correct: "Omanyte"
    }
];

let currentQuestionIndex = 0;
let score = 0;

const form = document.getElementById('trivia-form');
const questionLegend = document.querySelector('legend');
const optionGroup = document.querySelector('.option-group');
const submitBtn = document.querySelector('.submit-btn');

function loadQuestion() {
    const currentQuizData = quizData[currentQuestionIndex];

    questionLegend.innerText = `Question ${currentQuestionIndex + 1}: ${currentQuizData.question}`;

    optionGroup.innerHTML = '';

    currentQuizData.options.forEach(optionText => {
        const label = document.createElement('label');
        label.classList.add('option');

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'answer';
        input.value = optionText;

        const span = document.createElement('span');
        span.classList.add('custom-radio');

        label.appendChild(input);
        label.appendChild(span);
        label.appendChild(document.createTextNode(optionText));

        optionGroup.appendChild(label);
    });
}

function checkAnswer(e) {
    e.preventDefault();

    const selectedOption = document.querySelector('input[name="answer"]:checked');

    if (!selectedOption) {
        alert("Please select an answer, Trainer!");
        return;
    }

    const userAnswer = selectedOption.value;
    const correctAnswer = quizData[currentQuestionIndex].correct;

    if (userAnswer === correctAnswer) {
        score++;
        alert("It's Super Effective! (Correct)");
    } else {
        alert(`Not very effective... The correct answer was ${correctAnswer}`);
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        questionLegend.innerText = `Game Over! You caught ${score} out of ${quizData.length} correct.`;
        optionGroup.innerHTML = `<button class="submit-btn" onclick="location.reload()">Play Again</button>`;
        submitBtn.style.display = 'none';
    }
}

loadQuestion();
form.addEventListener('submit', checkAnswer);