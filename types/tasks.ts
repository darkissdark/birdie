export interface Task {
  _id: string;
  name: string;
  date: string;
  isDone: boolean;
}

export interface TasksResponse {
  tasks: Task[];
  totalCount: number;
  totalPages: number;
  page: number;
}
