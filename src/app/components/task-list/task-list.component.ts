import { Component, input, output } from '@angular/core';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  templateUrl: './task-list.component.html'
})
export class TaskListComponent {
  // Signal Input (Angular 21)
  tasks = input.required<Task[]>();

  // Signal Output — emits the task ID to toggle
  toggle = output<string>();

  onToggle(id: string): void {
    this.toggle.emit(id);
  }
}
