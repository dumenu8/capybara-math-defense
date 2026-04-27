import { Injectable } from '@angular/core';
import { GameSettings, Score, DEFAULT_SETTINGS } from '../models/types';
import { Preferences } from '@capacitor/preferences';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly SETTINGS_KEY = 'capybara_math_settings';
  private readonly SCORES_KEY = 'capybara_math_scores';

  async setItem(key: string, value: any) {
    const data = typeof value === 'string' ? value : JSON.stringify(value);
    await Preferences.set({key: key, value: data });
  }
  async getItem<T>(key: string): Promise<T | null> {
    const { value } = await Preferences.get({ key: key });
    if( value === null ) return null;
    
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }
  
  async getSettings(): Promise<GameSettings> {
    const data = await this.getItem(this.SETTINGS_KEY);
    if( data ) return <GameSettings>data;
    return { ...DEFAULT_SETTINGS };
  }
  saveSettings(settings: GameSettings) {
    this.setItem(this.SETTINGS_KEY, settings);
  }

  async getScores(): Promise<Score[]> {
    const data = await this.getItem(this.SCORES_KEY);
    if( data ) return <Score[]>data;
    return [];
  }
  async saveScore(score: Score) {
    const scores = await this.getScores();
    scores.push(score);
    scores.sort((a, b) => {
      if (b.correctAnswers !== a.correctAnswers) {
        return b.correctAnswers - a.correctAnswers;
      }
      return a.time - b.time; // Less time is better
    });
    const top5 = scores.slice(0, 5);
    this.setItem(this.SCORES_KEY, top5);
  }
}
