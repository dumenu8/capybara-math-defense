import {Routes} from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./components/splash/splash.component').then(m => m.SplashComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent)
  },
  {
    path: 'battle',
    loadComponent: () => import('./components/battle/battle.component').then(m => m.BattleComponent)
  },
  {
    path: 'result',
    loadComponent: () => import('./components/result/result.component').then(m => m.ResultComponent)
  },
  { path: '**', redirectTo: '' }
];
