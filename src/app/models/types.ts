export type Operator = '+' | '-' | '×' | '÷';

export interface GameSettings {
  maxAnswer: number;
  operators: Operator[];
  questionsPerBattle: number;
}

export interface Score {
  name: string;
  time: number;
  correctAnswers: number;
  date: number;
}

export interface MathQuestion {
  num1: number;
  operator: Operator;
  num2: number;
  answer: number;
}

export interface Enemy {
  id: string;
  name: string;
  emoji: string;
  themeClass: string;
}

export const ENEMIES: Enemy[] = [
  { id: 'crocodile', name: 'Grumpy Crocodile', emoji: '🐊', themeClass: 'bg-emerald-950' },
  { id: 'snake', name: 'Sneaky Snake', emoji: '🐍', themeClass: 'bg-green-900' },
  { id: 'monkey', name: 'Mischievous Monkey', emoji: '🐒', themeClass: 'bg-amber-900' },
  { id: 'bear', name: 'Growling Bear', emoji: '🐻', themeClass: 'bg-orange-950' },
  { id: 'wolf', name: 'Prowling Wolf', emoji: '🐺', themeClass: 'bg-slate-800' },
];

export const DEFAULT_SETTINGS: GameSettings = {
  maxAnswer: 50,
  operators: ['+', '-'],
  questionsPerBattle: 5,
};

export interface BattleVideo {
  idle: string;
  strike: string;
  miss: string;
  victory: string;
  defeated: string;
}
export const BATTLE_VIDEO_CAPYBARA: BattleVideo = {
  idle: '/capybara/capybara-idle-1.mp4',
  strike: '/capybara/capybara-strike-1.mp4',
  miss: '/capybara/capybara-miss-1.mp4',
  victory: '/capybara/capybara-victory-1.mp4',
  defeated: '/capybara/capybara-defeat-1.mp4',
};
export const BATTLE_VIDEO_CROCODILE: BattleVideo = {
  idle: '/crocodile/crocodile-idle-1.mp4',
  strike: '/crocodile/crocodile-strike-1.mp4',
  miss: '/crocodile/crocodile-miss-1.mp4',
  victory: '/crocodile/crocodile-victory-1.mp4',
  defeated: '/crocodile/crocodile-defeat-1.mp4',
};
export const BATTLE_VIDEO_SNAKE: BattleVideo = {
  idle: '/snake/snake-idle-1.mp4',
  strike: '/snake/snake-strike-1.mp4',
  miss: '/snake/snake-miss-1.mp4',
  victory: '/snake/snake-victory-1.mp4',
  defeated: '/snake/snake-defeat-1.mp4',
};
export const BATTLE_VIDEO_MONKEY: BattleVideo = {
  idle: '/monkey/monkey-idle-1.mp4',
  strike: '/monkey/monkey-strike-1.mp4',
  miss: '/monkey/monkey-miss-1.mp4',
  victory: '/monkey/monkey-victory-1.mp4',
  defeated: '/monkey/monkey-defeat-1.mp4',
};
export const BATTLE_VIDEO_BEAR: BattleVideo = {
  idle: '/bear/bear-idle-1.mp4',
  strike: '/bear/bear-strike-1.mp4',
  miss: '/bear/bear-miss-1.mp4',
  victory: '/bear/bear-victory-1.mp4',
  defeated: '/bear/bear-defeat-1.mp4',
};
export const BATTLE_VIDEO_WOLF: BattleVideo = {
  idle: '/wolf/wolf-idle-1.mp4',
  strike: '/wolf/wolf-strike-1.mp4',
  miss: '/wolf/wolf-miss-1.mp4',
  victory: '/wolf/wolf-victory-1.mp4',
  defeated: '/wolf/wolf-defeat-1.mp4',
};