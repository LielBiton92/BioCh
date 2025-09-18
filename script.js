const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedbackMessage = document.getElementById('feedback-message');
const nextButton = document.getElementById('next-button');

const allQuestions = [...questions];
let availableQuestions = [...allQuestions];
let currentQuestion = null;

let correctAnswersCount = 0;
let incorrectQuestions = [];

let totalQuestionsInCurrentSession = allQuestions.length;

function loadRandomQuestion() {
    if (availableQuestions.length === 0) {
        showQuizSummary();
        return;
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[randomIndex];

    availableQuestions.splice(randomIndex, 1);

    optionsContainer.innerHTML = '';
    feedbackMessage.textContent = '';
    nextButton.style.display = 'none';
    questionText.textContent = currentQuestion.question;

    const shuffledOptions = [...currentQuestion.options];
    shuffledOptions.sort(() => Math.random() - 0.5);
    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-button');
        button.addEventListener('click', () => checkAnswer(button, option));
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(selectedButton, selectedOption) {
    const isCorrect = selectedOption === currentQuestion.answer;
    document.querySelectorAll('.option-button').forEach(button => {
        button.disabled = true;
    });

    if (isCorrect) {
        selectedButton.classList.add('correct');
        feedbackMessage.textContent = 'כל הכבוד! תשובה נכונה 🎉';
        correctAnswersCount++;
    } else {
        selectedButton.classList.add('incorrect');
        feedbackMessage.textContent = `טעות. התשובה הנכונה היא: ${currentQuestion.answer}`;
        incorrectQuestions.push(currentQuestion);
        document.querySelectorAll('.option-button').forEach(button => {
            if (button.textContent === currentQuestion.answer) {
                button.classList.add('correct');
            }
        });
    }

    nextButton.style.display = 'block';
}

function showQuizSummary() {
    questionText.textContent = `כל הכבוד! סיימת את כל השאלות.`;
    feedbackMessage.textContent = `ענית נכון על ${correctAnswersCount} מתוך ${totalQuestionsInCurrentSession} שאלות.`;
    optionsContainer.innerHTML = '';
    nextButton.style.display = 'none';

    const actionButtonsContainer = document.createElement('div');
    actionButtonsContainer.classList.add('quiz-actions');

    if (incorrectQuestions.length > 0) {
        const redoIncorrectBtn = document.createElement('button');
        redoIncorrectBtn.textContent = 'התחל מחדש את השאלות שטעיתי';
        redoIncorrectBtn.classList.add('action-button', 'redo-incorrect-btn');
        redoIncorrectBtn.addEventListener('click', () => {
            availableQuestions = [...incorrectQuestions];
            incorrectQuestions = [];
            correctAnswersCount = 0;
            totalQuestionsInCurrentSession = availableQuestions.length; 
            loadRandomQuestion();
        });
        actionButtonsContainer.appendChild(redoIncorrectBtn);
    }

    const restartAllBtn = document.createElement('button');
    restartAllBtn.textContent = 'התחל מחדש את כל השאלות';
    restartAllBtn.classList.add('action-button', 'restart-all-btn');
    restartAllBtn.addEventListener('click', () => {
        availableQuestions = [...allQuestions];
        incorrectQuestions = [];
        correctAnswersCount = 0;
        totalQuestionsInCurrentSession = allQuestions.length;
        loadRandomQuestion();
    });
    actionButtonsContainer.appendChild(restartAllBtn);

    optionsContainer.appendChild(actionButtonsContainer);
}

document.addEventListener('DOMContentLoaded', loadRandomQuestion);


nextButton.addEventListener('click', loadRandomQuestion);

