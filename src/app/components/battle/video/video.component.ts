import { Component, AfterViewInit, signal, input, viewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BattleVideo } from '../../../models/types';

@Component({
  selector: 'app-battle-video',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video.component.html',
})
export class BattleVideoComponent implements AfterViewInit {
  battleVideo = input.required<BattleVideo>();
  hero = input.required<boolean>();
  enemy = input.required<boolean>();

  videoIdle = viewChild.required<ElementRef<HTMLVideoElement>>('videoIdle');
  videoStrike = viewChild.required<ElementRef<HTMLVideoElement>>('videoStrike');
  videoMiss = viewChild.required<ElementRef<HTMLVideoElement>>('videoMiss');

  showStrike = signal(false);
  showMiss = signal(false);

  ngAfterViewInit(): void {
    this.initVideo(this.videoIdle(), this.battleVideo().idle);
    this.initVideo(this.videoStrike(), this.battleVideo().strike);
    this.initVideo(this.videoMiss(), this.battleVideo().miss);
    this.playIdle();
  }
  initVideo(el: ElementRef<HTMLVideoElement>, src: string): void {
    const video = el.nativeElement;
    if (!video) return;

    video.src = src;
    video.load();
    // Listen for when the video has enough info to know its duration/size
    video.onloadedmetadata = () => {
      // Seek to 0.1 seconds - this forces the browser to render the frame
      video.currentTime = 0.1; 
    };
  }

  playStrike(): void {
    this.showStrike.set(true);
    this.videoStrike().nativeElement.play();
    setTimeout( () => this.showStrike.set(false), 1100);
  }
  playMiss(): void {
    this.showMiss.set(true);
    this.videoMiss().nativeElement.play();
    setTimeout( () => this.showMiss.set(false), 1100);
  }
  playIdle(): void {
    this.playWhenReady(this.battleVideo().idle);
  }
  playVictory(): void {
    this.playWhenReady(this.battleVideo().victory);
  }
  playDefeat(): void {
    this.playWhenReady(this.battleVideo().defeated);
  }
  
  async playWhenReady(newUrl: string) {
    const video = this.videoIdle()?.nativeElement;
    if (!video) return;

    // 1. Update the source
    video.src = newUrl;
    video.load(); // Force the browser to start loading the new src

    // 2. Create a Promise that resolves only when the video is ready
    const readyToPlay = new Promise<void>((resolve) => {
      video.oncanplaythrough = () => {
        resolve();
        video.oncanplaythrough = null; // Clean up listener
      };
    });

    // 3. Wait for the promise, then play
    await readyToPlay;
    try {
      await video.play();
    } catch (err) {
      console.warn("Playback blocked by browser policy", err);
    }
  }

}
