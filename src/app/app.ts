import { Component, inject, signal, computed } from '@angular/core';
import { TaskService } from './core/task.service';
import { TaskListComponent } from './components/task-list/task-list.component';
import { AddTaskComponent } from './components/add-task/add-task.component';

type Tab = 'today' | 'scheduled' | 'done';

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

  // Tab state as a signal
  currentTab = signal<Tab>('today');

  // Computed filtered + sorted list based on active tab
  filteredTasks = computed(() => {
    const tab = this.currentTab();
    const all = this.tasks();

    const filtered = all.filter(task => {
      if (tab === 'today')     return task.status === 'today';
      if (tab === 'scheduled') return task.status === 'scheduled' && !!task.dueDate;
      if (tab === 'done')      return task.status === 'done';
      return false;
    });

    // Sort by createdAt DESC (newest first)
    return filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });

  setTab(tab: Tab): void {
    this.currentTab.set(tab);
  }

  onAddTask(title: string): void {
    this.taskService.addTask(title);
  }
}
