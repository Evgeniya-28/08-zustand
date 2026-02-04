// app/lib/api.ts

import axios from "axios";
import type { Note, NoteFormValues } from "../types/note";

type FetchNotesResponse = {
  readonly notes: Note[];
  readonly totalPages: number;
};

const API_KEY = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const axiosInstance = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${API_KEY}`,
  },
});

async function fetchNotes(
  page: number = 1,
  search?: string,
  tag?: string,
): Promise<FetchNotesResponse> {
  const { data } = await axiosInstance.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage: 12,
      search,
      tag,
    },
  });
  return data;
}

async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await axiosInstance.get<Note>(`/notes/${id}`);
  return data;
}

async function createNote(newNote: NoteFormValues): Promise<Note> {
  const { data } = await axiosInstance.post<Note>("/notes", newNote);
  return data;
}

async function deleteNote(id: string): Promise<Note> {
  const { data } = await axiosInstance.delete<Note>(`/notes/${id}`);
  return data;
}

export { fetchNotes, fetchNoteById, createNote, deleteNote };
