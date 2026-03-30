import { Component, ElementRef, output, viewChild, afterNextRender, signal } from '@angular/core';

// Shape of data collected when a task is created
export interface TaskPayload {
  title: string;
  dueDateTime?: string;
  duration?: number;
  label?: string;
  repeat?: 'none' | 'daily' | 'weekly';
  type?: 'task' | 'habit';
  habit?: { target: number; frequency: 'daily' | 'weekly' };
}

@Component({
  selector: 'app-add-task',
  standalone: true,
  templateUrl: './add-task.component.html'
})
export class AddTaskComponent {
  add = output<TaskPayload>();

  // DOM ref for title input
  inputRef = viewChild<ElementRef<HTMLInputElement>>('taskInput');

  // Metadata signals — will be wired into payload in 42b
  dueDateTime = signal<string>('');
  duration    = signal<string>('');
  label       = signal<string>('');
  repeat      = signal<'none' | 'daily' | 'weekly'>('none');

  // Habit signals
  isHabit     = signal<boolean>(false);
  habitTarget = signal<string>('');
  habitFrequency = signal<'daily' | 'weekly'>('daily');

  constructor() {
    afterNextRender(() => {
      this.inputRef()?.nativeElement.focus();
    });
  }

  onAdd(): void {
    const input = this.inputRef()?.nativeElement;
    if (!input) return;

    const title = input.value.trim();
    if (!title) return;

    // Build payload from signals — output type stays string until 42c
    const rawDuration = parseFloat(this.duration());
    const rawHabitTarget = parseFloat(this.habitTarget());
    const payload: TaskPayload = {
      title,
      dueDateTime: this.dueDateTime() || undefined,
      duration:    isNaN(rawDuration) ? undefined : rawDuration,
      label:       this.label().trim() || undefined,
      repeat:      this.repeat() !== 'none' ? this.repeat() : undefined,
      type:        this.isHabit() ? 'habit' : 'task',
      habit:       this.isHabit() ? {
        target: isNaN(rawHabitTarget) ? 1 : rawHabitTarget,
        frequency: this.habitFrequency()
      } : undefined,
    };

    this.add.emit(payload); // emit full payload

    // Reset all fields after emit
    input.value = '';
    this.dueDateTime.set('');
    this.duration.set('');
    this.label.set('');
    this.repeat.set('none');
    this.isHabit.set(false);
    this.habitTarget.set('');
    this.habitFrequency.set('daily');
  }
}
