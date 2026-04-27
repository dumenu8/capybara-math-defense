import { Injectable } from '@angular/core';
import { GameSettings, MathQuestion } from '../models/types';

@Injectable({ providedIn: 'root' })
export class MathService {
  generateQuestions(settings: GameSettings, count: number): MathQuestion[] {
    const questions: MathQuestion[] = [];
    const usedSet = new Set<string>();

    let attempts = 0;
    const maxAttempts = count * 200; // Safeguard against infinite loops

    const operators = settings.operators.length > 0 ? settings.operators : ['+'];

    while (questions.length < count && attempts < maxAttempts) {
      attempts++;
      const operator = operators[Math.floor(Math.random() * operators.length)];
      let num1 = 0;
      let num2 = 0;
      let answer = 0;

      if (operator === '+') {
        answer = this.getRandomInt(2, settings.maxAnswer);
        num1 = this.getRandomInt(1, answer - 1);
        num2 = answer - num1;
      } else if (operator === '-') {
        num1 = this.getRandomInt(2, settings.maxAnswer);
        num2 = this.getRandomInt(1, num1 - 1);
        answer = num1 - num2;
      } else if (operator === '×') {
        // Cap num1 reasonably so it's not impossible to multiply offhand for kids
        const maxRoot = Math.max(2, Math.floor(Math.sqrt(Math.max(4, settings.maxAnswer))));
        num1 = this.getRandomInt(2, maxRoot);
        const maxNum2 = Math.max(2, Math.floor(settings.maxAnswer / num1));
        num2 = this.getRandomInt(2, maxNum2);
        answer = num1 * num2;
      } else if (operator === '÷') {
          answer = this.getRandomInt(2, Math.floor(Math.sqrt(settings.maxAnswer)));
          num2 = this.getRandomInt(2, 12);
          num1 = answer * num2;
          if (num1 > settings.maxAnswer) continue;
      }

      const key = `${num1}${operator}${num2}`;
      if (!usedSet.has(key)) {
        usedSet.add(key);
        questions.push({ num1, operator: operator as any, num2, answer });
      }
    }
    
    // Fallback if we somehow can't generate enough unique questions under constraints
    while(questions.length < count) {
      questions.push({num1: 1, operator: '+', num2: 1, answer: 2})
    }
    
    return questions;
  }

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
