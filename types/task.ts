export interface CreateTask {
  name: string;
  date: string;
}
export interface Task {
  name: string;
  date: string;
  _id: string;
  isDone: boolean;
}
