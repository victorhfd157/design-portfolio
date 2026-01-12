import { MathProblem, MathConfig } from '../types';

export const generateMathProblem = (config: MathConfig): MathProblem => {
  let min = 2, max = 10;

  if (config.difficulty === 'MEDIUM') { max = 20; }
  else if (config.difficulty === 'HARD') { max = 50; }

  const operator = config.operators[Math.floor(Math.random() * config.operators.length)];
  let a = Math.floor(Math.random() * (max - min)) + min;
  let b = Math.floor(Math.random() * (max - min)) + min;
  let answer = 0;
  let question = '';

  switch (operator) {
    case '+':
      answer = a + b;
      question = `${a} + ${b}`;
      break;
    case '-':
      if (a < b) [a, b] = [b, a];
      answer = a - b;
      question = `${a} - ${b}`;
      break;
    case 'x':
      // Easier multipliers for fairness
      max = config.difficulty === 'HARD' ? 12 : (config.difficulty === 'MEDIUM' ? 9 : 5);
      a = Math.floor(Math.random() * max) + 2;
      b = Math.floor(Math.random() * max) + 2;
      answer = a * b;
      question = `${a} x ${b}`;
      break;
    case '÷':
      // Generate clean divisions
      max = config.difficulty === 'HARD' ? 12 : 9;
      b = Math.floor(Math.random() * max) + 2;
      answer = Math.floor(Math.random() * max) + 2;
      a = b * answer;
      question = `${a} ÷ ${b}`;
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