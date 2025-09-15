// קוד ה-JavaScript הראשי שלך
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedbackMessage = document.getElementById('feedback-message');
const nextButton = document.getElementById('next-button');

// שומר עותק של כל השאלות המקוריות
const allQuestions = [...questions];
let availableQuestions = [...allQuestions];
let currentQuestion = null;

// משתנים למעקב אחר התוצאות
let correctAnswersCount = 0;
let incorrectQuestions = [];

// משתנה חדש למעקב אחר מספר השאלות בסשן הנוכחי
let totalQuestionsInCurrentSession = allQuestions.length;

// פונקציה לטעינת שאלה אקראית
function loadRandomQuestion() {
    // אם נגמרו השאלות הזמינות, הצג את סיכום החידון
    if (availableQuestions.length === 0) {
        showQuizSummary();
        return;
    }

    // בחר שאלה אקראית מתוך השאלות הזמינות
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[randomIndex];

    // הסר את השאלה מהמערך
    availableQuestions.splice(randomIndex, 1);

    // נקה מסך והצג את השאלה
    optionsContainer.innerHTML = '';
    feedbackMessage.textContent = '';
    nextButton.style.display = 'none';
    questionText.textContent = currentQuestion.question;

    // ערבב את האפשרויות וצור כפתורים
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

// פונקציה לבדיקת תשובת המשתמש
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
        // שמור את השאלה השגויה במערך
        incorrectQuestions.push(currentQuestion);
        document.querySelectorAll('.option-button').forEach(button => {
            if (button.textContent === currentQuestion.answer) {
                button.classList.add('correct');
            }
        });
    }

    // הצג את כפתור "לשאלה הבאה"
    nextButton.style.display = 'block';
}

// פונקציה שמציגה את סיכום החידון ואת האפשרויות הנוספות
function showQuizSummary() {
    questionText.textContent = `כל הכבוד! סיימת את החידון.`;
    // שינוי כאן: שימוש במשתנה החדש totalQuestionsInCurrentSession
    feedbackMessage.textContent = `ענית נכון על ${correctAnswersCount} מתוך ${totalQuestionsInCurrentSession} שאלות.`;
    optionsContainer.innerHTML = '';
    nextButton.style.display = 'none';

    const actionButtonsContainer = document.createElement('div');
    actionButtonsContainer.classList.add('quiz-actions');

    // כפתור "התחל מחדש את השאלות שטעיתי"
    if (incorrectQuestions.length > 0) {
        const redoIncorrectBtn = document.createElement('button');
        redoIncorrectBtn.textContent = 'התחל מחדש את השאלות שטעיתי';
        redoIncorrectBtn.classList.add('action-button', 'redo-incorrect-btn');
        redoIncorrectBtn.addEventListener('click', () => {
            availableQuestions = [...incorrectQuestions];
            incorrectQuestions = [];
            correctAnswersCount = 0;
            // עדכון המשתנה עם מספר השאלות החדש
            totalQuestionsInCurrentSession = availableQuestions.length; 
            loadRandomQuestion();
        });
        actionButtonsContainer.appendChild(redoIncorrectBtn);
    }

    // כפתור "התחל מחדש את כל השאלות"
    const restartAllBtn = document.createElement('button');
    restartAllBtn.textContent = 'התחל מחדש את כל השאלות';
    restartAllBtn.classList.add('action-button', 'restart-all-btn');
    restartAllBtn.addEventListener('click', () => {
        availableQuestions = [...allQuestions];
        incorrectQuestions = [];
        correctAnswersCount = 0;
        // עדכון המשתנה עם מספר השאלות המקורי
        totalQuestionsInCurrentSession = allQuestions.length;
        loadRandomQuestion();
    });
    actionButtonsContainer.appendChild(restartAllBtn);

    optionsContainer.appendChild(actionButtonsContainer);
}

// טען שאלה ראשונית
document.addEventListener('DOMContentLoaded', loadRandomQuestion);

// הוסף מאזין לאירוע לחיצה על כפתור "לשאלה הבאה"
nextButton.addEventListener('click', loadRandomQuestion);