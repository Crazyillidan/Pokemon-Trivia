
const getElement = selector => document.querySelector(selector);

let quizData = {};

document.addEventListener("DOMContentLoaded", () => {
    
    let currentQuestionIndex = 0;
    let score = 0;
    let isWaiting = false;
    let currentQuestions = []; 

    const startScreen = getElement('#start-screen');
    const gameContainer = getElement('#game-container');
    const creatorScreen = getElement('#creator-screen');

    const form = getElement('#trivia-form');
    const questionLegend = getElement('legend');
    const optionGroup = getElement('.option-group');
    const submitBtn = getElement('.submit-btn');
    const feedbackEl = getElement('#feedback-message');
    const diffButtons = document.querySelectorAll('.diff-btn');
    const restartBtn = getElement('#restart-btn');

    const toCreatorBtn = getElement('#to-creator-btn');
    const cancelCreateBtn = getElement('#cancel-create-btn');
    const addForm = getElement('#add-question-form');
    const creatorFeedback = getElement('#creator-feedback');

    fetch('questions.json')
        .then(response => {
            if (!response.ok) throw new Error("HTTP error " + response.status);
            return response.json();
        })
        .then(data => {
            quizData = data;
            console.log("Questions loaded:", quizData);
        })
        .catch(error => {
            console.error("Could not load questions:", error);
            document.querySelector('.difficulty-group').innerHTML = 
                `<p style="color:red; background:white; padding:10px; border-radius:5px;">
                Error loading questions. Ensure you are running a Local Server.
                </p>`;
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
                restartBtn.style.display = 'none'; 
            }
        }, 1500); 
    };

    diffButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (Object.keys(quizData).length === 0) {
                alert("Data is loading... please wait.");
                return;
            }

            const difficulty = e.target.getAttribute('data-diff');
            const fullPool = [...quizData[difficulty]];
            shuffleArray(fullPool);
            
            currentQuestions = fullPool.slice(0, 10);
            
            currentQuestionIndex = 0;
            score = 0;

            gameContainer.classList.remove('theme-great', 'theme-ultra');
            if (difficulty === 'normal') {
                gameContainer.classList.add('theme-great');
            } else if (difficulty === 'hard') {
                gameContainer.classList.add('theme-ultra');
            }

            startScreen.classList.add('hidden');
            gameContainer.classList.remove('hidden');
            restartBtn.style.display = 'block'; 
            
            loadQuestion();
        });
    });

    restartBtn.addEventListener('click', () => {
        gameContainer.classList.add('hidden');
        startScreen.classList.remove('hidden');

        gameContainer.classList.remove('theme-great', 'theme-ultra');
        feedbackEl.textContent = '';
        feedbackEl.className = 'feedback-text';
    });

    toCreatorBtn.addEventListener('click', () => {
        startScreen.classList.add('hidden');
        creatorScreen.classList.remove('hidden');
    });

    cancelCreateBtn.addEventListener('click', () => {
        creatorScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
        addForm.reset();
        creatorFeedback.textContent = '';
    });

    addForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const difficulty = getElement('#new-difficulty').value;
        const questionText = getElement('#new-q').value;
        const opt1 = getElement('#new-opt-1').value;
        const opt2 = getElement('#new-opt-2').value;
        const opt3 = getElement('#new-opt-3').value;
        const opt4 = getElement('#new-opt-4').value;
        const correctIndex = getElement('#new-correct-index').value;

        const optionsArray = [opt1, opt2, opt3, opt4];
        const correctAnswerText = optionsArray[correctIndex];

        const newQuestion = {
            question: questionText,
            options: optionsArray,
            correct: correctAnswerText
        };

        if (quizData[difficulty]) {
            quizData[difficulty].push(newQuestion);
            
            creatorFeedback.textContent = `Saved to ${difficulty} mode!`;
            creatorFeedback.className = 'feedback-text success-msg';
            
            setTimeout(() => {
                addForm.reset();
                creatorFeedback.textContent = '';
                creatorFeedback.className = 'feedback-text';
                
                creatorScreen.classList.add('hidden');
                startScreen.classList.remove('hidden');
            }, 1500);

        } else {
            creatorFeedback.textContent = "Error: Data not loaded.";
            creatorFeedback.className = 'feedback-text error-msg';
        }
    });

    form.addEventListener('submit', checkAnswer);
});