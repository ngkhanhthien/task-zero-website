import { Component, inject } from '@angular/core';
import { TaskService } from './core/task.service';
import { TaskListComponent } from './components/task-list/task-list.component';
import { AddTaskComponent } from './components/add-task/add-task.component';

@Component({
  selector: 'app-root',
  imports: [TaskListComponent, AddTaskComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private taskService = inject(TaskService);
  
  // Directly reference the service Signal — no async pipe needed!
  tasks = this.taskService.tasks;

  onAddTask(title: string): void {
    this.taskService.addTask(title);
  }
}
