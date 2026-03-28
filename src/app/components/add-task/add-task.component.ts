import { Component, ElementRef, output, viewChild, afterNextRender, signal } from '@angular/core';

// Shape of data collected when a task is created
export interface TaskPayload {
  title: string;
  dueDateTime?: string;
  duration?: number;
  label?: string;
  repeat?: 'none' | 'daily' | 'weekly';
}

@Component({
  selector: 'app-add-task',
  standalone: true,
  templateUrl: './add-task.component.html'
})
export class AddTaskComponent {
  add = output<string>();

  // DOM ref for title input
  inputRef = viewChild<ElementRef<HTMLInputElement>>('taskInput');

  // Metadata signals — will be wired into payload in 42b
  dueDateTime = signal<string>('');
  duration    = signal<string>('');
  label       = signal<string>('');
  repeat      = signal<'none' | 'daily' | 'weekly'>('none');

  constructor() {
    afterNextRender(() => {
      this.inputRef()?.nativeElement.focus();
    });
  }

  onAdd(): void {
    const input = this.inputRef()?.nativeElement;
    if (!input) return;

    const title = input.value.trim();
    if (title) {
      this.add.emit(title);
      input.value = ''; // Reset the input field
    }
  }
}
