import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import { AudioService, SfxType } from '../../services/audio.service';
import { Operator } from '../../models/types';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule, CommonModule],
  host: { 'class': 'flex-1 flex flex-col h-full w-full overflow-hidden' },
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  fb = inject(FormBuilder);
  router = inject(Router);
  storage = inject(StorageService);
  audio = inject(AudioService);

  form!: FormGroup;
  showForm = signal(false);
  availableOperators: {symbol: Operator, name: string}[] = [
    {symbol: '+', name: 'Addition'},
    {symbol: '-', name: 'Subtraction'},
    {symbol: '×', name: 'Multiplication'},
    {symbol: '÷', name: 'Division'},
  ];

  operatorError = false;

  ngOnInit() {
    this.storage.getSettings().then( (settings) => {
      this.form = this.fb.group({
        maxAnswer: [settings.maxAnswer, [Validators.min(50), Validators.max(1000)]],
        questionsPerBattle: [settings.questionsPerBattle, [Validators.min(5), Validators.max(500)]],
        operators: [settings.operators] 
      });
      this.showForm.set(true);
    });
  }

  isOperatorSelected(op: Operator): boolean {
    const ops = this.form.get('operators')?.value as Operator[];
    return ops.includes(op);
  }

  toggleOperator(op: Operator) {
    this.audio.playSfx(SfxType.BUTTON_4);
    const ops = [...(this.form.get('operators')?.value as Operator[])];
    const idx = ops.indexOf(op);
    if (idx > -1) {
      ops.splice(idx, 1);
    } else {
      ops.push(op);
    }
    this.form.get('operators')?.setValue(ops);
    this.operatorError = ops.length < 2;
  }

  goBack() {
    this.audio.playSfx(SfxType.BUTTON_2);
    this.router.navigate(['/']);
  }

  saveAndReturn() {
    this.audio.playSfx(SfxType.BUTTON_1);
    const ops = this.form.get('operators')?.value as Operator[];
    if (ops.length < 2) {
      this.operatorError = true;
      return;
    }
    
    if (this.form.valid) {
      this.storage.saveSettings(this.form.value);
      this.router.navigate(['/']);
    }
  }
}
