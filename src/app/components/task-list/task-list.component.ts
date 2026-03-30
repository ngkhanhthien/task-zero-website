import { Component, input, output } from '@angular/core';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  // Signal Input (Angular 21)
  tasks = input.required<Task[]>();

  // Signal Outputs — emit task ID
  toggle = output<string>();
  delete = output<string>();

  onToggle(id: string): void {
    this.toggle.emit(id);
  }

  onDelete(id: string, event: MouseEvent): void {
    event.stopPropagation(); // Prevent triggering toggle
    this.delete.emit(id);
  }

  formatDateTime(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) +
      ' • ' + d.toLocaleDateString([], { month: 'short', day: '2-digit' });
  }
}
