// import { api } from "./api";
// import type { Note, NoteTag } from "@/types/note";
// import type { User } from "@/types/user";

// export interface FetchNotesParams {
//   page?: number;
//   perPage?: number;
//   search?: string;
//   tag?: NoteTag;
// }

// export interface FetchNotesResponse {
//   notes: Note[];
//   totalPages: number;
// }

// export const fetchNotes = async (
//   params: FetchNotesParams
// ): Promise<FetchNotesResponse> => {
//   const response = await api.get<FetchNotesResponse>("/notes", { params });
//   return response.data;
// };

// export interface CreateNoteParams {
//   title: string;
//   content: string;
//   tag: NoteTag;
// }

// export const createNote = async (data: CreateNoteParams): Promise<Note> => {
//   const response = await api.post<Note>("/notes", data);
//   return response.data;
// };

// export const deleteNote = async (id: string): Promise<Note> => {
//   const response = await api.delete<Note>(`/notes/${id}`);
//   return response.data;
// };

// export const fetchNoteById = async (id: string): Promise<Note> => {
//   const response = await api.get<Note>(`/notes/${id}`);
//   return response.data;
// };

// export type RegisterOrLoginRequest = {
//   email: string;
//   password: string;
// };

// export const register = async (data: RegisterOrLoginRequest) => {
//   const res = await api.post<User>("/auth/register", data);
//   return res.data;
// };

// export const login = async (data: RegisterOrLoginRequest) => {
//   const res = await api.post<User>("/auth/login", data);
//   return res.data;
// };

// export type updateProfileRequest = {
//   email: string;
//   username: string;
// };

// export const updateProfile = async (data: updateProfileRequest) => {
//   const res = await api.patch<User>("/users/me", data);
//   return res.data;
// };
