import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

export enum SfxType {
  HERO_HIT = 1,
  MISS_HIT = 2,
  
  BUTTON_1 = 11,
  BUTTON_2 = 12,
  BUTTON_3 = 13,
  BUTTON_4 = 14,
}

@Injectable({ providedIn: 'root' })
export class AudioService {
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);
  
  private bgmAudio!: HTMLAudioElement;
  isBgmMuted = signal(false);
  
  private readonly bgmUrl = '/background.ogg'; 
  private readonly heroHitUrl = '/hero-hit.ogg';
  private readonly missUrl = '/enemy-hit.ogg';
  private readonly button1Url = '/button-1.ogg';
  private readonly button2Url = '/button-2.ogg';
  private readonly button3Url = '/button-3.ogg';
  private readonly button4Url = '/button-4.ogg';

  constructor() {
    this.initBgm();
  }

  initBgm() {
    if( !this.bgmAudio && isPlatformBrowser(this.platformId) ) {
      this.bgmAudio = new Audio(this.bgmUrl);
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = 1;
    }

    // LISTEN FOR VISIBILITY CHANGES
    this.document.addEventListener('visibilitychange', () => {
      if (this.document.hidden) {
        this.bgmAudio.pause();
      } else {
        // Only resume if the user hasn't explicitly muted it via your UI button
        if (!this.isBgmMuted()) {
          this.bgmAudio.play().catch(err => console.log('Autoplay blocked'));
        }
      }
    });
  }
  playBgm() {
    // Handle autoplay restrictions gracefully
    if( this.bgmAudio ) this.bgmAudio.play().catch(() => {});
  }
  lowerBgm() {
    if( this.bgmAudio ) this.bgmAudio!.volume = 0.3;
  }
  nomralBgm() {
    if( this.bgmAudio ) this.bgmAudio!.volume = 1;
  }

  stopBgm() {
    if( this.bgmAudio ) {
      this.bgmAudio.pause();
      this.bgmAudio.currentTime = 0;
    }
  }

  playSfx(type: SfxType) {
    let url = '';
    let vol = 1.0;
    if (type === SfxType.HERO_HIT) { url = this.heroHitUrl; }
    else if (type === SfxType.MISS_HIT) { url = this.missUrl; }
    else if (type === SfxType.BUTTON_1) { url = this.button1Url; }
    else if (type === SfxType.BUTTON_2) { url = this.button2Url; }
    else if (type === SfxType.BUTTON_3) { url = this.button3Url; }
    else if (type === SfxType.BUTTON_4) { url = this.button4Url; }
    
    if (url) {
      const audio = new Audio(url);
      audio.volume = vol;
      audio.play().catch(() => {});
    }
  }
}
