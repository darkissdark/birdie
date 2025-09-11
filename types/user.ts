export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  dueDate: string;
  babyGender: string;
  theme: string;
}
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
