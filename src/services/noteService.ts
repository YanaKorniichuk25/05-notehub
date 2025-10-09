import { useQuery, type QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import type { Note } from "../types/note";

export type NotesResponse = {
  notes: Note[];
  totalPages: number;
};

axios.defaults.baseURL = "https://notehub-public.goit.study/api/";

const getToken = (): string => {
  const token = import.meta.env.VITE_NOTEHUB_TOKEN;
  if (!token) {
    throw new Error("Missing VITE_NOTEHUB_TOKEN");
  }
  return token;
};

export const fetchNotes = async (
  page = 1,
  search = ""
): Promise<NotesResponse> => {
  try {
    const token = getToken();
    const response = await axios.get<NotesResponse>("notes", {
      params: { page, perPage: 12, search },
      headers: { accept: "application/json", Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    toast.error("Could not load notes");
    throw error;
  }
};

export const createNote = async (data: {
  title: string;
  content?: string;
  tag: string;
}): Promise<Note> => {
  try {
    const token = getToken();
    const response = await axios.post<Note>("notes", data, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    toast.success("New note saved!");
    return response.data;
  } catch (error) {
    toast.error("Error creating note");
    throw error;
  }
};

export const removeNote = async (id: string): Promise<Note> => {
  try {
    const token = getToken();
    const response = await axios.delete<Note>(`notes/${id}`, {
      headers: { accept: "application/json", Authorization: `Bearer ${token}` },
    });
    toast.success("Note removed");
    return response.data;
  } catch (error) {
    toast.error("Error deleting note");
    throw error;
  }
};

export const useNotes = (currentPage: number, search: string) =>
  useQuery<NotesResponse>({
    queryKey: ["notes", currentPage, search],
    queryFn: ({ queryKey }: QueryFunctionContext) => {
      const [, page, searchTerm] = queryKey as [string, number, string];
      return fetchNotes(page, searchTerm);
    },
    staleTime: 30_000,
  });
