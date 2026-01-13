import { MathProblem, MathConfig } from '../types';

/**
 * Generates a math problem based on the provided configuration.
 * Handles different difficulty levels and operators (+, -, x, ÷).
 * 
 * @param config - The configuration object containing difficulty and allowed operators.
 * @returns A MathProblem object with the question string and numeric answer.
 */
export const generateMathProblem = (config: MathConfig): MathProblem => {
  let min = 2;
  let max = 10;

  // Adjust range based on difficulty
  if (config.difficulty === 'MEDIUM') {
    max = 20;
  } else if (config.difficulty === 'HARD') {
    max = 50;
  }

  // Safety check for operators
  if (!config.operators || config.operators.length === 0) {
    console.warn("No operators provided, defaulting to addition.");
    config.operators = ['+'];
  }

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
      // Ensure positive result for subtraction
      if (a < b) [a, b] = [b, a];
      answer = a - b;
      question = `${a} - ${b}`;
      break;
    case 'x':
      // Easier multipliers to avoid overly complex mental math in a fast game
      const multMax = config.difficulty === 'HARD' ? 12 : (config.difficulty === 'MEDIUM' ? 9 : 5);
      a = Math.floor(Math.random() * multMax) + 2;
      b = Math.floor(Math.random() * multMax) + 2;
      answer = a * b;
      question = `${a} x ${b}`;
      break;
    case '÷':
      // Generate clean divisions (no remainders)
      const divMax = config.difficulty === 'HARD' ? 12 : 9;
      b = Math.floor(Math.random() * divMax) + 2; // Divisor
      answer = Math.floor(Math.random() * divMax) + 2; // Quotient
      a = b * answer; // Dividend
      question = `${a} ÷ ${b}`;
      break;
    default:
      // Fallback
      answer = a + b;
      question = `${a} + ${b}`;
  }

  return { question, answer };
};

/**
 * Generates a plausible distractor answer close to the correct one.
 * 
 * @param correctAnswer - The actual correct answer.
 * @returns A number that is close to but not equal to the correct answer.
 */
export const generateDistractor = (correctAnswer: number): number => {
  const offset = Math.floor(Math.random() * 10) + 1; // 1 to 10 difference
  const sign = Math.random() > 0.5 ? 1 : -1;
  let distractor = correctAnswer + (offset * sign);

  // Ensure distractor is positive (game design choice) and unique
  if (distractor < 0) distractor = Math.abs(distractor);
  if (distractor === correctAnswer) distractor = correctAnswer + 1;

  return distractor;
};