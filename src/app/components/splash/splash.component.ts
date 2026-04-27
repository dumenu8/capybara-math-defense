import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AudioService, SfxType } from '../../services/audio.service';
import { GameService } from '../../services/game.service';
import { BATTLE_VIDEO_BEAR, BATTLE_VIDEO_CAPYBARA, BATTLE_VIDEO_CROCODILE, BATTLE_VIDEO_MONKEY, BATTLE_VIDEO_SNAKE, BATTLE_VIDEO_WOLF, ENEMIES, Enemy } from '../../models/types';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { VideoPreloader } from '../../util/video-preloader';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  host: { 
    'class': 'flex-1 flex flex-col h-full w-full overflow-hidden relative bg-[#0f172a]' 
  },
  templateUrl: './splash.component.html',
  styles: []
})
export class SplashComponent implements AfterViewInit {
  router = inject(Router);
  audio = inject(AudioService);
  game = inject(GameService);

  enemies = ENEMIES;
  isBgmMuted = signal<boolean>(false);

  ngAfterViewInit(): void {
    this.isBgmMuted.set( this.audio.isBgmMuted() );
    if( !this.isBgmMuted() ) {
      this.audio.playBgm();
      this.audio.nomralBgm();
    }
    //this.preloadBattleVideos(); //preload for web
  }
  preloadBattleVideos() {
    if( this.game.videoPreloaded() ) return;

    let url: string[] = [];
    url = url.concat(
      VideoPreloader.convertIntoArray(BATTLE_VIDEO_CAPYBARA),
      VideoPreloader.convertIntoArray(BATTLE_VIDEO_CROCODILE),
      VideoPreloader.convertIntoArray(BATTLE_VIDEO_SNAKE),
      VideoPreloader.convertIntoArray(BATTLE_VIDEO_MONKEY),
      VideoPreloader.convertIntoArray(BATTLE_VIDEO_BEAR),
      VideoPreloader.convertIntoArray(BATTLE_VIDEO_WOLF),
    );
    console.log('video preloader urls ', url);
    VideoPreloader.preloadQueue(url).then( () => {
      this.game.videoPreloaded.set(true);
    });
  }

  toggleBgmMute() {
    this.isBgmMuted.set(!this.isBgmMuted());
    this.audio.isBgmMuted.set(this.isBgmMuted());
    
    if (this.audio.isBgmMuted()) {
      this.audio.stopBgm();
    } else {
      this.audio.playBgm();
    }
  }
  goToSettings() {
    this.audio.playSfx(SfxType.BUTTON_1);
    this.router.navigate(['/settings']);
  }

  startBattle(enemy: Enemy) {
    this.audio.playSfx(SfxType.BUTTON_1);
    this.game.startGame(enemy);
    this.router.navigate(['/battle']);
  }

  getHoverRing(id: string): string {
    switch (id) {
      case 'crocodile': return 'hover:ring-emerald-400 hover:shadow-[0_0_20px_rgba(52,211,153,0.8)]';
      case 'snake': return 'hover:ring-lime-400 hover:shadow-[0_0_20px_rgba(163,230,53,0.8)]';
      case 'monkey': return 'hover:ring-purple-400 hover:shadow-[0_0_20px_rgba(192,132,252,0.8)]';
      case 'bear': return 'hover:ring-orange-400 hover:shadow-[0_0_20px_rgba(251,146,60,0.8)]';
      case 'wolf': return 'hover:ring-blue-400 hover:shadow-[0_0_20px_rgba(96,165,250,0.8)]';
      default: return 'hover:ring-white';
    }
  }
}


