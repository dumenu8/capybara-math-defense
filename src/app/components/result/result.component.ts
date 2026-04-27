import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { StorageService } from '../../services/storage.service';
import { AudioService, SfxType } from '../../services/audio.service';
import { Score } from '../../models/types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  host: { 'class': 'flex-1 flex flex-col h-full w-full overflow-hidden' },
  templateUrl: './result.component.html',
})
export class ResultComponent implements OnInit {
  game = inject(GameService);
  storage = inject(StorageService);
  router = inject(Router);
  fb = inject(FormBuilder);
  audio = inject(AudioService);

  topScores = signal<Score[]>([]);
  showsNewHighScore = signal(false);
  scoreForm!: FormGroup;
  
  private currentScoreObj: Score | null = null; // To highlight

  constructor() {
    effect(() => {
      console.log('Signal Updated:', this.topScores());
    });
  }

  ngOnInit() {
    this.scoreForm = this.fb.group({
      playerName: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(1)]]
    });

    this.storage.getScores().then( (topScores) => {
      this.topScores.set(topScores);
      this.checkHighScore();
    });
    
    // Play sound on enter
    if (this.game.correctCount() > this.game.incorrectCount()) {
        this.audio.playSfx(SfxType.HERO_HIT);
    }
  }

  checkHighScore() {
    // Top 5 logic
    const correct = this.game.correctCount();
    if (correct === 0) return; // Need at least 1 correct answer 
    
    if (this.topScores().length < 5) {
      this.showsNewHighScore.set(true);
      return;
    }
    
    const time = this.game.timerSeconds();
    const lastPlace = this.topScores()[this.topScores().length - 1];
    
    // If better than 5th place
    if (correct > lastPlace.correctAnswers || (correct === lastPlace.correctAnswers && time < lastPlace.time)) {
       this.showsNewHighScore.set(true);
    }
  }

  submitScore() {
    if (this.scoreForm.valid) {
      this.audio.playSfx(SfxType.BUTTON_2);
      const score: Score = {
        name: this.scoreForm.value.playerName.trim() || 'UNKNOWN',
        time: this.game.timerSeconds(),
        correctAnswers: this.game.correctCount(),
        date: Date.now()
      };
      
      this.storage.saveScore(score).then( () => {
        this.currentScoreObj = score;
        this.showsNewHighScore.set(false);
      
        // Refresh list
        this.storage.getScores().then( (topScores) => this.topScores.set([...topScores]));
      });
      
    }
  }

  isCurrentScore(score: Score): boolean {
    return this.currentScoreObj !== null && this.currentScoreObj.date === score.date;
  }

  playAgain() {
    this.audio.playSfx(SfxType.BUTTON_1);
    this.router.navigate(['/']);
  }
  
  getFormattedTime(s: number): string {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }
}
