import { MathProblem } from '../types';

export const generateMathProblem = (difficulty: number): MathProblem => {
  // Difficulty scales the range of numbers
  const maxNum = 9 + Math.floor(difficulty / 2);
  const operators = ['+', '-', 'x'];
  const operator = operators[Math.floor(Math.random() * operators.length)];

  let a = Math.floor(Math.random() * maxNum) + 2;
  let b = Math.floor(Math.random() * maxNum) + 2;
  let answer = 0;
  let question = '';

  switch (operator) {
    case '+':
      answer = a + b;
      question = `${a} + ${b}`;
      break;
    case '-':
      // Ensure positive result for simplicity
      if (a < b) [a, b] = [b, a];
      answer = a - b;
      question = `${a} - ${b}`;
      break;
    case 'x':
      // Lower max number for multiplication to keep it mental-math friendly
      a = Math.floor(Math.random() * 10) + 1;
      b = Math.floor(Math.random() * 10) + 1;
      answer = a * b;
      question = `${a} x ${b}`;
      break;
  }

  return { question, answer };
};

export const generateDistractor = (correctAnswer: number): number => {
  const offset = Math.floor(Math.random() * 10) + 1;
  const sign = Math.random() > 0.5 ? 1 : -1;
  let distractor = correctAnswer + (offset * sign);
  
  // Ensure distractor is positive and not equal to answer
  if (distractor < 0) distractor = Math.abs(distractor);
  if (distractor === correctAnswer) distractor = correctAnswer + 1;
  
  return distractor;
};