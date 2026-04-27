import { Component, inject, computed, signal, effect, OnDestroy, viewChild } from '@angular/core';
import { GameService } from '../../services/game.service';
import { AudioService, SfxType } from '../../services/audio.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BattleVideoComponent } from './video/video.component';
import { BATTLE_VIDEO_BEAR, BATTLE_VIDEO_CAPYBARA, BATTLE_VIDEO_CROCODILE, BATTLE_VIDEO_MONKEY, BATTLE_VIDEO_SNAKE, BATTLE_VIDEO_WOLF, BattleVideo } from '../../models/types';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-battle',
  standalone: true,
  imports: [CommonModule, BattleVideoComponent, MatIconModule],
  host: { 'class': 'flex-1 flex flex-col h-full w-full overflow-hidden' },
  templateUrl: './battle.component.html',
})
export class BattleComponent implements OnDestroy {
  heroBattleVideoComponent = viewChild.required<BattleVideoComponent>('heroBattleVideoComponent');
  enemyBattleVideoComponent = viewChild.required<BattleVideoComponent>('enemyBattleVideoComponent');

  game = inject(GameService);
  audio = inject(AudioService);
  router = inject(Router);

  enemy = this.game.selectedEnemy;
  currentQ = this.game.currentQuestion;

  input = signal<string>('');

  isHeroAttacking = signal(false);
  isEnemyAttacking = signal(false);
  isHit = signal(false);
  isHeroHit = signal(false);

  heroBattleVideo = BATTLE_VIDEO_CAPYBARA;
  enemyBattleVideo = signal<BattleVideo>(<BattleVideo>{});

  formattedTime = computed(() => {
    const s = this.game.timerSeconds();
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  });

  constructor() {
    if (!this.enemy() || this.game.questions().length === 0) {
      this.router.navigate(['/']); // Prevent refreshing on battle page
    } else {
      this.audio.lowerBgm();
    }
    if( this.enemy()?.id == 'crocodile' ) this.enemyBattleVideo.set(BATTLE_VIDEO_CROCODILE);
    else if( this.enemy()?.id == 'snake' ) this.enemyBattleVideo.set(BATTLE_VIDEO_SNAKE);
    else if( this.enemy()?.id == 'monkey' ) this.enemyBattleVideo.set(BATTLE_VIDEO_MONKEY);
    else if( this.enemy()?.id == 'bear' ) this.enemyBattleVideo.set(BATTLE_VIDEO_BEAR);
    else if( this.enemy()?.id == 'wolf' ) this.enemyBattleVideo.set(BATTLE_VIDEO_WOLF);
  }

  ngOnDestroy() {
    this.audio.stopBgm();
  }

  appendNum(n: number) {
    if (this.game.isGameOver() || this.isHeroAttacking() || this.isEnemyAttacking()) return;
    this.audio.playSfx(SfxType.BUTTON_4);
    if (this.input().length < 6) { 
      this.input.update(val => val + n);
    }
  }

  clear() {
    if (this.game.isGameOver() || this.isHeroAttacking() || this.isEnemyAttacking()) return;
    this.audio.playSfx(SfxType.BUTTON_2);
    this.input.set('');
  }

  submit() {
    if (!this.input() || this.game.isGameOver() || this.isHeroAttacking() || this.isEnemyAttacking()) return;
    this.audio.playSfx(SfxType.BUTTON_3);
    const ans = parseInt(this.input(), 10);
    const isCorrect = this.game.submitAnswer(ans);
    
    if (isCorrect) {
      this.triggerCorrectAnim();
    } else {
      this.triggerIncorrectAnim();
    }
  }

  triggerCorrectAnim() {
    this.isHeroAttacking.set(true);
    this.heroBattleVideoComponent().playStrike();
    this.enemyBattleVideoComponent().playMiss();

    setTimeout(() => {
      this.audio.playSfx(SfxType.HERO_HIT);
      this.isHit.set(true);
    }, 150);

    setTimeout(() => {
      this.input.set('');
      this.isHeroAttacking.set(false);
      this.isHit.set(false);
      this.advance();
    }, 700);
  }

  triggerIncorrectAnim() {
    this.isEnemyAttacking.set(true);
    this.heroBattleVideoComponent().playMiss();
    this.enemyBattleVideoComponent().playStrike();

    setTimeout(() => {
      this.audio.playSfx(SfxType.MISS_HIT);
      this.isHeroHit.set(true);
    }, 150);

    setTimeout(() => {
      this.input.set('');
      this.isEnemyAttacking.set(false);
      this.isHeroHit.set(false);
      this.advance();
    }, 700);
  }

  triggerHeroVictory() {
    this.heroBattleVideoComponent().playVictory();
    this.enemyBattleVideoComponent().playDefeat();
    setTimeout(() => {
      this.router.navigate(['/result'])
    }, 3000);
  }
  triggerEnemyVictory() {
    this.heroBattleVideoComponent().playDefeat();
    this.enemyBattleVideoComponent().playVictory();
    setTimeout(() => {
      this.router.navigate(['/result'])
    }, 3000);
  }

  advance() {
    this.game.nextQuestion();
    if (this.game.isGameOver()) {
      if( this.game.correctCount() > this.game.incorrectCount() ) this.triggerHeroVictory();
      else this.triggerEnemyVictory();
    }
  }

  exit() {
    this.audio.playSfx(SfxType.BUTTON_3);
    this.router.navigate(['']);
  }


}
