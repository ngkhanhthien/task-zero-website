import { Injectable, signal, effect } from '@angular/core';
import { Task } from '../models/task.model';

const STORAGE_KEY = 'tasks';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // Local signal store — mirrors what a REST API response would look like.
  // TODO: Replace with HttpClient calls to environment.apiUrl
  tasks = signal<Task[]>(this.loadFromStorage());

  constructor() {
    // effect() auto-saves to localStorage whenever tasks signal changes
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks()));
    });
  }

  private loadFromStorage(): Task[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Task[]) : [];
    } catch {
      return [];
    }
  }

  // GET /tasks
  getAll(): void {
    // TODO: this.http.get<Task[]>(`${environment.apiUrl}/tasks`)
    //   .subscribe(tasks => this.tasks.set(tasks));
  }

  // POST /tasks
  addTask(payload: { title: string; dueDateTime?: string; duration?: number; label?: string; repeat?: 'none' | 'daily' | 'weekly' }): void {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title:       payload.title,
      status:      'today',
      createdAt:   new Date().toISOString(),
      dueDateTime: payload.dueDateTime,
      duration:    payload.duration,
      label:       payload.label,
      repeat:      payload.repeat,
    };
    this.tasks.update(tasks => [...tasks, newTask]);
    // TODO: this.http.post<Task>(`${environment.apiUrl}/tasks`, payload)
  }

  // PATCH /tasks/:id
  updateTaskStatus(id: string, status: 'today' | 'scheduled' | 'done'): void {
    this.tasks.update(tasks =>
      tasks.map(task => {
        if (task.id === id) {
          // One-way completion to match product behavior
          if (task.status === 'done' && status === 'today') {
            return task;
          }
          return { ...task, status };
        }
        return task;
      })
    );
    // TODO: this.http.patch(`${environment.apiUrl}/tasks/${id}`, { status })
    //   .subscribe(() => { /* refresh or update signal */ });
  }

  // DELETE /tasks/:id
  deleteTask(id: string): void {
    // Soft delete for future sync with backend
    this.tasks.update(tasks =>
      tasks.map(task => task.id === id ? { ...task, status: 'deleted' } : task)
    );
    // TODO: this.http.delete(`${environment.apiUrl}/tasks/${id}`)
    //   .subscribe(() => ...);
  }

  // DELETE /tasks?status=done
  clearDoneTasks(): void {
    this.tasks.update(tasks => tasks.filter(task => task.status !== 'done'));
    // TODO: this.http.delete(`${environment.apiUrl}/tasks`, { params: { status: 'done' } })
    //   .subscribe(() => this.tasks.update(t => t.filter(task => task.status !== 'done')));
  }

  // Reset daily tasks to scheduled
  resetDaily(): void {
    this.tasks.update(tasks =>
      tasks.map(task => {
        if (task.status === 'today') {
          return { ...task, status: 'scheduled' };
        }
        return task;
      })
    );
  }

  // TODO: integrate with backend API
  // Using modern async/await for Signal-friendly data fetching (replaces RxJS)
  async syncFromServer(): Promise<void> {
    // Placeholder for backend GET request
    // e.g., const response = await fetch('/api/tasks');
    // const data = await response.json();
    // this.tasks.set(data);
    console.log('Syncing from server...');
  }

  // TODO: integrate with backend API 
  async syncToServer(): Promise<void> {
    // Placeholder for backend Sync request
    // e.g., await fetch('/api/sync', { 
    //   method: 'POST', 
    //   body: JSON.stringify(this.tasks()) 
    // });
    console.log('Syncing to server...');
  }
}
