import { Injectable, signal } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // Local signal store — mirrors what a REST API response would look like.
  // TODO: Replace with HttpClient calls to environment.apiUrl
  tasks = signal<Task[]>([]);

  constructor() {}

  // GET /tasks
  getAll(): void {
    // TODO: this.http.get<Task[]>(`${environment.apiUrl}/tasks`)
    //   .subscribe(tasks => this.tasks.set(tasks));
  }

  // POST /tasks
  addTask(title: string): void {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      status: 'today',
      createdAt: new Date().toISOString()
    };
    this.tasks.update(tasks => [...tasks, newTask]);
    // TODO: this.http.post<Task>(`${environment.apiUrl}/tasks`, { title })
    //   .subscribe(task => this.tasks.update(t => [...t, task]));
  }

  // PATCH /tasks/:id
  updateTaskStatus(id: string, status: 'today' | 'scheduled' | 'done'): void {
    this.tasks.update(tasks =>
      tasks.map(task => task.id === id ? { ...task, status } : task)
    );
    // TODO: this.http.patch(`${environment.apiUrl}/tasks/${id}`, { status })
    //   .subscribe(() => { /* refresh or update signal */ });
  }

  // DELETE /tasks/:id
  deleteTask(id: string): void {
    this.tasks.update(tasks => tasks.filter(task => task.id !== id));
    // TODO: this.http.delete(`${environment.apiUrl}/tasks/${id}`)
    //   .subscribe(() => this.tasks.update(t => t.filter(task => task.id !== id)));
  }

  // DELETE /tasks?status=done
  clearDoneTasks(): void {
    this.tasks.update(tasks => tasks.filter(task => task.status !== 'done'));
    // TODO: this.http.delete(`${environment.apiUrl}/tasks`, { params: { status: 'done' } })
    //   .subscribe(() => this.tasks.update(t => t.filter(task => task.status !== 'done')));
  }
}
