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
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Topmost 'today' task (or overdue)
    return this.tasks()
      .filter(task => {
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
}
