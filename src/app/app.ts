import { Component, inject, signal, computed } from '@angular/core';
import { TaskService } from './core/task.service';
import { ThemeService, ThemeMode } from './core/theme.service';
import { TaskListComponent } from './components/task-list/task-list.component';
import { AddTaskComponent, TaskPayload } from './components/add-task/add-task.component';

type Tab = 'today' | 'scheduled' | 'done';

@Component({
  selector: 'app-root',
  imports: [TaskListComponent, AddTaskComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private taskService = inject(TaskService);
  themeService = inject(ThemeService);

  // Expose pomodoro state for template
  pomodoro = this.taskService.pomodoro;

  toggleTheme(): void {
    const current = this.themeService.theme();
    if (current === 'system') {
      this.themeService.setTheme('light');
    } else if (current === 'light') {
      this.themeService.setTheme('dark');
    } else {
      this.themeService.setTheme('system');
    }
  }

  // Directly reference the service Signal — no async pipe needed!
  tasks = this.taskService.tasks;

  // Tab state as a signal
  currentTab = signal<Tab>('today');

  // Computed filtered + sorted list based on active tab
  filteredTasks = computed(() => {
    const tab = this.currentTab();
    const all = this.tasks();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const filtered = all.filter(task => {
      let isOverdue = false;
      if (task.status === 'scheduled' && task.dueDate) {
        const due = new Date(task.dueDate);
        due.setHours(0, 0, 0, 0);
        isOverdue = due.getTime() < todayStart.getTime();
      }

      // Treat overdue tasks as today's tasks
      if (tab === 'today') return task.status === 'today' || isOverdue;
      if (tab === 'scheduled') return task.status === 'scheduled' && !!task.dueDate && !isOverdue;
      if (tab === 'done') return task.status === 'done';
      return false;
    });

    // Sort by createdAt DESC (newest first)
    return filtered.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });

  focusTask = computed(() => {
    const allTasks = this.tasks();
    const now = new Date().getTime();

    // 1. Pick task with nearest upcoming dueDateTime (not yet passed)
    const timedTasks = allTasks
      .filter(t => t.dueDateTime && t.status !== 'done' && new Date(t.dueDateTime).getTime() >= now)
      .sort((a, b) => new Date(a.dueDateTime!).getTime() - new Date(b.dueDateTime!).getTime());

    if (timedTasks.length > 0) return timedTasks[0];

    // 2. Fallback: First 'today' task by createdAt (newest first)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    return allTasks
      .filter(task => {
        if (task.status === 'done') return false;
        
        let isOverdue = false;
        if (task.status === 'scheduled' && task.dueDate) {
          const due = new Date(task.dueDate);
          due.setHours(0, 0, 0, 0);
          isOverdue = due.getTime() < todayStart.getTime();
        }
        return task.status === 'today' || isOverdue;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  });

  remainingTasks = computed(() => {
    const focus = this.focusTask();
    return this.filteredTasks().filter(t => t.id !== focus?.id);
  });

  focusTaskId = computed(() => this.focusTask()?.id);

  setTab(tab: Tab): void {
    this.currentTab.set(tab);
  }

  onAddTask(payload: TaskPayload): void {
    this.taskService.addTask(payload);
  }

  onToggleTask(id: string): void {
    const task = this.tasks().find(t => t.id === id);
    if (!task) return;
    // Toggle between today and done
    const nextStatus = task.status === 'done' ? 'today' : 'done';
    this.taskService.updateTaskStatus(id, nextStatus);
  }

  onDeleteTask(id: string): void {
    this.taskService.deleteTask(id);
  }

  // Pomodoro timer controls
  startPomodoro(): void {
    this.taskService.startPomodoro();
  }

  pausePomodoro(): void {
    this.taskService.pausePomodoro();
  }

  resetPomodoro(): void {
    this.taskService.resetPomodoro();
  }

  formatDateTime(iso: string | undefined): string {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) +
      ' • ' + d.toLocaleDateString([], { month: 'short', day: '2-digit' });
  }

  formatTimer(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}
