import { Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { TaskService } from './core/task.service';

@Component({
  selector: 'app-root',
  imports: [AsyncPipe, JsonPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private taskService = inject(TaskService);
  
  // Expose tasks stream
  tasks$ = this.taskService.getTasks();
}
