// import { cookies } from "next/headers";
// import { api } from "./api";
// import type { User } from "@/types/user";
// import { Note, NoteTag } from "@/types/note";

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

// export const fetchServerNotes = async (
//   params: FetchNotesParams
// ): Promise<FetchNotesResponse> => {
//   const cookieStore = await cookies();
//   const response = await api.get<FetchNotesResponse>("/notes", {
//     params,
//     headers: {
//       Cookie: cookieStore.toString(),
//     },
//   });
//   return response.data;
// };

// export const checkServerSession = async () => {
//   const cookieStore = await cookies();
//   const res = await api.get("/auth/session", {
//     headers: {
//       Cookie: cookieStore.toString(),
//     },
//   });
//   return res;
// };

// export const getServerMe = async (): Promise<User> => {
//   const cookieStore = await cookies();
//   const { data } = await api.get("/users/me", {
//     headers: {
//       Cookie: cookieStore.toString(),
//     },
//   });
//   return data;
// };

// export const fetchServerNoteById = async (id: string): Promise<Note> => {
//   const cookieStore = await cookies();
//   const response = await api.get<Note>(`/notes/${id}`, {
//     headers: {
//       Cookie: cookieStore.toString(),
//     },
//   });
//   return response.data;
// };
