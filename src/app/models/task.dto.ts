export interface TaskDto {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  dueDate?: string;
  updatedAt: string;
  userId: string;
}
