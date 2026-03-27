import { Injectable, signal } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // Thay BehaviorSubject bằng signal
  tasks = signal<Task[]>([]);

  constructor() {}

  addTask(title: string): void {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      status: 'today',
      createdAt: new Date().toISOString()
    };
    this.tasks.update(tasks => [...tasks, newTask]);
    
    // TODO: Replace bằng HttpClient + environment.apiUrl
  }

  updateTaskStatus(id: string, status: 'today' | 'scheduled' | 'done'): void {
    this.tasks.update(tasks => tasks.map(task => 
      task.id === id ? { ...task, status } : task
    ));
    
    // TODO: Replace bằng HttpClient + environment.apiUrl
  }

  deleteTask(id: string): void {
    this.tasks.update(tasks => tasks.filter(task => task.id !== id));
    
    // TODO: Replace bằng HttpClient + environment.apiUrl
  }

  clearDoneTasks(): void {
    this.tasks.update(tasks => tasks.filter(task => task.status !== 'done'));
    
    // TODO: Replace bằng HttpClient + environment.apiUrl
  }
}
