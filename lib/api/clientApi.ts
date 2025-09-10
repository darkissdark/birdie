import { User } from "@/types/user";
import { nextServer } from "./api";

export interface Credentials {
  name?: string;
  email: string;
  password: string;
}

export async function register(credentials: Credentials) {
  await nextServer.post<User>("/auth/register", credentials);
}
export async function login(credentials: Credentials) {
  const { data } = await nextServer.post<User>("/auth/login", credentials);
  return data;
}
