// src/components/Dashboard.js
import React, { useState } from 'react';
import '../Dashboard/QuestionsBank.css';

const questions = [
  {
    questionText: 'Inside which HTML element do we put the JavaScript?',
    options: ['<script>', '<javascript>', '<scripting>', '<js>'],
    correctAnswer: '<script>',
  },
  {
    questionText: 'What is the correct syntax for referring to an external script called "xxx.js"?',
    options: ['<script href="xxx.js">', '<script name="xxx.js">', '<script src="xxx.js">', '<script file="xxx.js">'],
    correctAnswer: '<script src="xxx.js">',
  },
  {
    questionText: 'How do you write "Hello World" in an alert box?',
    options: ['alertBox("Hello World");', 'alert("Hello World");', 'msgBox("Hello World");', 'msg("Hello World");'],
    correctAnswer: 'alert("Hello World");',
  },
  {
    questionText: 'How do you create a function in JavaScript?',
    options: ['function myFunction()', 'function:myFunction()', 'function = myFunction()', 'def myFunction()'],
    correctAnswer: 'function myFunction()',
  },
  {
    questionText: 'How do you call a function named "myFunction"?',
    options: ['call myFunction()', 'call function myFunction()', 'myFunction()', 'run myFunction()'],
    correctAnswer: 'myFunction()',
  },
  {
    questionText: 'How to write an IF statement in JavaScript?',
    options: ['if i = 5 then', 'if i == 5 then', 'if (i == 5)', 'if i = 5'],
    correctAnswer: 'if (i == 5)',
  },
  {
    questionText: 'How does a WHILE loop start?',
    options: ['while (i <= 10; i++)', 'while (i <= 10)', 'while i = 1 to 10', 'while (i <= 10 i++)'],
    correctAnswer: 'while (i <= 10)',
  },
  {
    questionText: 'How does a FOR loop start?',
    options: ['for (i = 0; i <= 5; i++)', 'for (i <= 5; i++)', 'for i = 1 to 5', 'for (i = 0; i <= 5)'],
    correctAnswer: 'for (i = 0; i <= 5; i++)',
  },
  {
    questionText: 'How can you add a comment in JavaScript?',
    options: ['<!-- This is a comment -->', '// This is a comment', '\' This is a comment', '/* This is a comment */'],
    correctAnswer: '// This is a comment',
  },
  {
    questionText: 'What is the correct way to write a JavaScript array?',
    options: ['var colors = ["red", "green", "blue"]', 'var colors = "red", "green", "blue"', 'var colors = (1:"red", 2:"green", 3:"blue")', 'var colors = ["1: red", "2: green", "3: blue"]'],
    correctAnswer: 'var colors = ["red", "green", "blue"]',
  },
  {
    questionText: 'How do you round the number 7.25 to the nearest integer?',
    options: ['round(7.25)', 'Math.round(7.25)', 'Math.rnd(7.25)', 'Math.rounded(7.25)'],
    correctAnswer: 'Math.round(7.25)',
  },
  {
    questionText: 'How do you find the number with the highest value of x and y?',
    options: ['Math.ceil(x, y)', 'Math.max(x, y)', 'ceil(x, y)', 'top(x, y)'],
    correctAnswer: 'Math.max(x, y)',
  },
  {
    questionText: 'What is the correct JavaScript syntax for opening a new window called "w2"?',
    options: ['w2 = window.open("http://www.w3schools.com");', 'w2 = window.new("http://www.w3schools.com");', 'w2 = open("http://www.w3schools.com");', 'w2 = new.window("http://www.w3schools.com");'],
    correctAnswer: 'w2 = window.open("http://www.w3schools.com");',
  },
  {
    questionText: 'JavaScript is the same as Java.',
    options: ['True', 'False'],
    correctAnswer: 'False',
  },
  {
    questionText: 'How can you detect the client\'s browser name?',
    options: ['browser.name', 'client.navName', 'navigator.appName', 'navigator.name'],
    correctAnswer: 'navigator.appName',
  }
];

const QuestionsBank = ({navigate}) => {
  const [selectedAnswers, setSelectedAnswers] = useState(Array(questions.length).fill(null));
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerOptionClick = (answer, index) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[index] = answer;
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleSubmit = () => {
    const calculatedScore = selectedAnswers.reduce((acc, answer, index) => {
      return answer === questions[index].correctAnswer ? acc + 1 : acc;
    }, 0);

    setScore(calculatedScore);
    setShowScore(true);
  };

  const goBack = () => {
    navigate('dashboard');
  };

  return (
    <div className="quiz-container">
<button type="button" className="back-button" onClick={goBack}>Back</button>
      {showScore ? (
        <div className="score-section">
          You scored {score} out of {questions.length}
        </div>
      ) : (
        <>
          {questions.map((question, index) => (
            <div key={index} className="question-section">
              <div className="question-count">
                <span>Question {index + 1}</span>/{questions.length}
              </div>
              <div className="question-text">{question.questionText}</div>
              <div className="answer-section">
                {question.options.map((option) => (
                  <label key={option} className={`option ${selectedAnswers[index] === option ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      onClick={() => handleAnswerOptionClick(option, index)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button className="submit-button" onClick={handleSubmit}>Submit</button>
        </>
      )}
    </div>
  );
};

export default QuestionsBank;
