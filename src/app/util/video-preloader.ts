import { BattleVideo } from "../models/types";

export class VideoPreloader {
  /**
   * Preloads an array of video URLs one by one.
   * @param urls Array of file paths
   * @returns A promise that resolves when the entire queue is finished
   */
  public static async preloadQueue(urls: string[]): Promise<void> {
    for (const url of urls) {
      try {
        await this.preloadVideo(url);
        console.log(`Finished preloading: ${url}`);
      } catch (error) {
        console.error(`Failed to load ${url}`, error);
        // Continue to next video even if one fails
      }
    }
    console.log('All videos preloaded.');
  }
  public static convertIntoArray(battleVideo: BattleVideo): string [] {
    return [battleVideo.strike,battleVideo.miss,battleVideo.victory,battleVideo.defeated];
  }
  private static preloadVideo(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.src = url;
      video.preload = 'auto';

      // canplaythrough suggests the full file is buffered enough for uninterrupted play
      video.oncanplaythrough = () => {
        resolve();
        video.oncanplaythrough = null; // Cleanup
      };

      video.onerror = () => {
        reject(`Error loading: ${url}`);
      };

      // Force the browser to start the request
      video.load();
    });
  }
}