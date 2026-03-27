import { Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { TaskService } from './core/task.service';
import { TaskListComponent } from './components/task-list/task-list.component';

@Component({
  selector: 'app-root',
  imports: [AsyncPipe, JsonPipe, TaskListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private taskService = inject(TaskService);
  
  // Expose tasks stream
  tasks$ = this.taskService.getTasks();
}
