export interface Task {
  id: string;
  title: string;
  status: 'today' | 'scheduled' | 'done';
  createdAt: string;
  dueDate?: string;
}
