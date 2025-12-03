
const getElement = selector => document.querySelector(selector);

let quizData = {};

document.addEventListener("DOMContentLoaded", () => {
    
    let currentQuestionIndex = 0;
    let score = 0;
    let isWaiting = false;
    let currentQuestions = []; 

    const startScreen = getElement('#start-screen');
    const gameContainer = getElement('#game-container');
    const form = getElement('#trivia-form');
    const questionLegend = getElement('legend');
    const optionGroup = getElement('.option-group');
    const submitBtn = getElement('.submit-btn');
    const feedbackEl = getElement('#feedback-message');
    const diffButtons = document.querySelectorAll('.diff-btn');

    fetch('questions.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .then(data => {
            quizData = data; 
            console.log("Questions loaded successfully!", quizData);
        })
        .catch(error => {
            console.error("Could not load questions:", error);
            document.querySelector('.difficulty-group').innerHTML = 
                `<p style="color:red">Error loading questions. Please ensure you are running a Local Server.</p>`;
        });


    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    const loadQuestion = () => {
        const currentQuizData = currentQuestions[currentQuestionIndex];
        questionLegend.innerText = `Question ${currentQuestionIndex + 1}: ${currentQuizData.question}`;
        optionGroup.innerHTML = '';
        feedbackEl.textContent = ''; 
        feedbackEl.className = 'feedback-text';

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
    };

    const checkAnswer = (e) => {
        e.preventDefault();
        if (isWaiting) return;

        const selectedOption = getElement('input[name="answer"]:checked');

        if (!selectedOption) {
            feedbackEl.textContent = "Please select an answer, Trainer!";
            feedbackEl.classList.add('error-msg');
            return;
        }

        const userAnswer = selectedOption.value;
        const correctAnswer = currentQuestions[currentQuestionIndex].correct;

        isWaiting = true;

        if (userAnswer === correctAnswer) {
            score++;
            feedbackEl.textContent = "It's Super Effective! (Correct)";
            feedbackEl.className = 'feedback-text success-msg';
        } else {
            feedbackEl.textContent = `Not very effective... The answer was ${correctAnswer}`;
            feedbackEl.className = 'feedback-text error-msg';
        }

        submitBtn.disabled = true;

        setTimeout(() => {
            currentQuestionIndex++;
            isWaiting = false;
            submitBtn.disabled = false;

            if (currentQuestionIndex < currentQuestions.length) {
                loadQuestion();
            } else {
                questionLegend.innerText = `Game Over! You caught ${score} out of ${currentQuestions.length} correct.`;
                optionGroup.innerHTML = '';
                feedbackEl.textContent = '';
                
                const reloadBtn = document.createElement('button');
                reloadBtn.innerText = "Play Again";
                reloadBtn.classList.add('submit-btn');
                reloadBtn.addEventListener('click', () => location.reload());
                
                optionGroup.appendChild(reloadBtn);
                form.querySelector('button[type="submit"]').style.display = 'none';
            }
        }, 1500); 
    };

    diffButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (Object.keys(quizData).length === 0) {
                alert("Data is still loading or failed to load. Please wait a moment.");
                return;
            }

            const difficulty = e.target.getAttribute('data-diff');
            currentQuestions = quizData[difficulty];
            shuffleArray(currentQuestions);
            
            startScreen.classList.add('hidden');
            gameContainer.classList.remove('hidden');
            loadQuestion();
        });
    });

    form.addEventListener('submit', checkAnswer);
});