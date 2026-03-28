export interface Task {
  id: string;
  title: string;
  status: 'today' | 'scheduled' | 'done' | 'deleted';
  createdAt: string;
  dueDate?: string;
}
