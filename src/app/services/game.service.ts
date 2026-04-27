import { Injectable, signal, computed } from '@angular/core';
import { Enemy, MathQuestion } from '../models/types';
import { MathService } from './math.service';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class GameService {
  readonly selectedEnemy = signal<Enemy | null>(null);
  readonly questions = signal<MathQuestion[]>([]);
  readonly currentQuestionIndex = signal<number>(0);
  readonly correctCount = signal<number>(0);
  readonly incorrectCount = signal<number>(0);
  readonly timerSeconds = signal<number>(0);
  readonly videoPreloaded = signal<boolean>(false);
  
  private intervalId: any;

  readonly currentQuestion = computed(() => {
    const q = this.questions();
    const idx = this.currentQuestionIndex();
    if (idx < q.length) return q[idx];
    return null;
  });

  readonly isGameOver = computed(() => {
    return this.questions().length > 0 && this.currentQuestionIndex() >= this.questions().length;
  });

  constructor(
    private mathService: MathService,
    private storageService: StorageService
  ) {}

  startGame(enemy: Enemy) {
    this.selectedEnemy.set(enemy);
    this.storageService.getSettings().then( (settings) => {
      const generated = this.mathService.generateQuestions(settings, settings.questionsPerBattle);
      this.questions.set(generated);
    });
    this.currentQuestionIndex.set(0);
    this.correctCount.set(0);
    this.incorrectCount.set(0);
    this.timerSeconds.set(0);
    this.startTimer();
  }

  startTimer() {
    this.stopTimer();
    this.intervalId = setInterval(() => {
      this.timerSeconds.update(s => s + 1);
    }, 1000);
  }

  stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  submitAnswer(answer: number): boolean {
    const curr = this.currentQuestion();
    if (!curr) return false;

    const isCorrect = curr.answer === answer;
    if (isCorrect) {
      this.correctCount.update(c => c + 1);
    } else {
      this.incorrectCount.update(c => c + 1);
    }
    return isCorrect;
  }

  nextQuestion() {
    this.currentQuestionIndex.update(i => i + 1);
    if (this.isGameOver()) {
      this.stopTimer();
    }
  }
}
