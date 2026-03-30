import { Injectable, signal, effect, computed } from '@angular/core';
import { Task } from '../models/task.model';
import { TaskPayload } from '../components/add-task/add-task.component';

const STORAGE_KEY = 'tasks';

interface PomodoroState {
  status: 'idle' | 'work' | 'break' | 'longBreak';
  timeLeft: number; // in seconds
  currentSession: number;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // Local signal store — mirrors what a REST API response would look like.
  // TODO: Replace with HttpClient calls to environment.apiUrl
  tasks = signal<Task[]>(this.loadFromStorage());

  // Pomodoro timer state
  pomodoro = signal<PomodoroState>({ status: 'idle', timeLeft: 0, currentSession: 0 });

  private pomodoroInterval?: number;

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
  addTask(payload: TaskPayload): void {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title:       payload.title,
      status:      'today',
      createdAt:   new Date().toISOString(),
      dueDateTime: payload.dueDateTime,
      duration:    payload.duration,
      label:       payload.label,
      repeat:      payload.repeat,
      type:        payload.type || 'task',
      habit:       payload.habit ? { ...payload.habit, streak: 0 } : undefined,
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

          // Habit tracking: increment streak when habit is completed
          if (task.type === 'habit' && status === 'done' && task.status !== 'done') {
            return {
              ...task,
              status,
              habit: task.habit ? { ...task.habit, streak: task.habit.streak + 1 } : undefined
            };
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

  // Pomodoro timer methods
  startPomodoro(workMinutes = 25, breakMinutes = 5, longBreakMinutes = 15, sessions = 4): void {
    if (this.pomodoroInterval) clearInterval(this.pomodoroInterval);
    
    this.pomodoro.set({
      status: 'work',
      timeLeft: workMinutes * 60,
      currentSession: 1
    });

    this.pomodoroInterval = window.setInterval(() => {
      this.pomodoro.update(state => {
        if (state.timeLeft <= 1) {
          // Session complete
          if (state.status === 'work') {
            const isLongBreak = state.currentSession % sessions === 0;
            return {
              status: isLongBreak ? 'longBreak' : 'break',
              timeLeft: isLongBreak ? longBreakMinutes * 60 : breakMinutes * 60,
              currentSession: state.currentSession
            };
          } else {
            // Break complete, start next work session
            return {
              status: 'work',
              timeLeft: workMinutes * 60,
              currentSession: state.currentSession + 1
            };
          }
        }
        return { ...state, timeLeft: state.timeLeft - 1 };
      });
    }, 1000);
  }

  pausePomodoro(): void {
    if (this.pomodoroInterval) {
      clearInterval(this.pomodoroInterval);
      this.pomodoroInterval = undefined;
    }
  }

  resetPomodoro(): void {
    if (this.pomodoroInterval) {
      clearInterval(this.pomodoroInterval);
      this.pomodoroInterval = undefined;
    }
    this.pomodoro.set({ status: 'idle', timeLeft: 0, currentSession: 0 });
  }

  // Habit-specific computed signals
  get habits() {
    return computed(() => this.tasks().filter(task => task.type === 'habit'));
  }

  get habitStreaks() {
    return computed(() => 
      this.habits().map(habit => ({
        id: habit.id,
        title: habit.title,
        streak: habit.habit?.streak || 0,
        target: habit.habit?.target || 1,
        frequency: habit.habit?.frequency || 'daily'
      }))
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
