export interface Task {
  id: string;
  title: string;
  status: 'today' | 'scheduled' | 'done' | 'deleted';
  createdAt: string;
  dueDate?: string;
  // Backend-ready ISO datetime format
  dueDateTime?: string;
  // Estimated task duration in minutes
  duration?: number;
  // Recurrence pattern (undefined treated as 'none')
  repeat?: 'none' | 'daily' | 'weekly';
  // Short text tag to categorize the task
  label?: string;
}
