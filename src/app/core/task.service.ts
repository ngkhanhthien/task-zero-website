import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);

  constructor() {}

  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  addTask(title: string): void {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      status: 'today',
      createdAt: new Date().toISOString()
    };
    const currentTasks = this.tasksSubject.value;
    this.tasksSubject.next([...currentTasks, newTask]);
    
    // TODO: Replace bằng HttpClient + environment.apiUrl
  }

  updateTaskStatus(id: string, status: 'today' | 'scheduled' | 'done'): void {
    const currentTasks = this.tasksSubject.value;
    const updatedTasks = currentTasks.map(task => 
      task.id === id ? { ...task, status } : task
    );
    this.tasksSubject.next(updatedTasks);
    
    // TODO: Replace bằng HttpClient + environment.apiUrl
  }

  deleteTask(id: string): void {
    const currentTasks = this.tasksSubject.value;
    const filteredTasks = currentTasks.filter(task => task.id !== id);
    this.tasksSubject.next(filteredTasks);
    
    // TODO: Replace bằng HttpClient + environment.apiUrl
  }

  clearDoneTasks(): void {
    const currentTasks = this.tasksSubject.value;
    const filteredTasks = currentTasks.filter(task => task.status !== 'done');
    this.tasksSubject.next(filteredTasks);
    
    // TODO: Replace bằng HttpClient + environment.apiUrl
  }
}
