import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.component.html'
})
export class TaskListComponent {
  // Thay @Input() bằng signal input() bắt buộc
  tasks = input.required<Task[]>();
}
